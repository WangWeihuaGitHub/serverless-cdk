const AWS = require("aws-sdk");
const thundra = require("@thundra/core")();
const s3 = new AWS.S3();
exports.handler = thundra(async ({ Records }) => {
    for (let record of Records) {
        const { bucket, object } = record.s3;
        const { Body } = await s3
            .getObject({
            Bucket: bucket.name,
            Key: object.key
        })
            .promise();
        const processedData = Body.toString("utf-8").toUpperCase();
        await s3
            .putObject({
            Bucket: process.env.TARGET_BUCKET_NAME,
            Key: object.key,
            Body: processedData
        }).promise();
    }
});