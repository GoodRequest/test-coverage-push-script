#!/usr/bin/env node

const join = require('path').join
const readFileSync = require('fs').readFileSync
const request = require('https').request

const cwd = process.cwd()

const codeCoverageFilePath = join(cwd, 'coverage/lcov-report/index.html')
const codeCoverageString = readFileSync(codeCoverageFilePath, 'utf8')

const nthIndex = (str, sub, n) => {
    let i = -1
    while(n-- && i++ < str.length){
        i = str.indexOf(sub, i)
        if (i < 0) break
    }
    return i
}

const codeCoverageData = codeCoverageString
    .substring(
        codeCoverageString.indexOf('clearfix') + 10,
        nthIndex(codeCoverageString, '</div>', 4)
    )
    .split('/div')
    .reduce((a, c) =>
        a.concat([{
            coverageType: c.substring(
                c.indexOf('quiet') + 7,
                nthIndex(c, '</span>', 2)
            ).trim(),
            coverageCount: c.substring(
                c.indexOf('fraction') + 10,
                nthIndex(c, '</span>', 3)
            ).trim(),
            coveragePercentage: c.substring(
                c.indexOf('strong') + 8,
                nthIndex(c, '</span>', 1)
            ).trim()
        }])
    , [])

const dataIsValid = codeCoverageData.every(el => {
    const t1 = ['Statements', 'Branches', 'Functions', 'Lines'].includes(el.coverageType)
    const t2 = el.coverageCount.split('/')[0] <= el.coverageCount.split('/')[1]
    const t3 = !!parseFloat(el.coveragePercentage) && el.coveragePercentage.includes('%')
    return t1 && t2 && t3
})

if (!dataIsValid) {
    throw new Error('Invalid code coverage data')
}

const packageJSONPath = join(cwd, 'package.json')
const packageJSON = require(packageJSONPath)
const packageName = packageJSON.name

const codeCoverageFile = readFileSync(codeCoverageFilePath, 'base64')

const body = JSON.stringify({ packageName, codeCoverageFile })

const username = process.env.TEST_COVERAGE_USERNAME
const password = process.env.TEST_COVERAGE_PASSWORD

const credentials = Buffer.from(`${username}:${password}`).toString('base64')

const url = process.env.TEST_COVERAGE_URL

const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        Authorization: `Basic ${credentials}`,
    }
}

const requestCallback = (res) => console.log(`STATUS: ${res.statusCode}`)

const errorCallback = (err) => console.error(err.message)

const req = request(url, options, requestCallback).on('error', errorCallback)

req.write(body)

req.end()
