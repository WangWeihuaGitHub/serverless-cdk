const path = require("path");
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const lambda = require("@aws-cdk/aws-lambda");
const lambdaEventSources = require("@aws-cdk/aws-lambda-event-sources");

const THUNDRA_API_KEY = "<YOUR_THUNDRA_API_KEY>";
const THUNDRA_AWS_ACCOUNT_NO = 269863060030;
const THUNDRA_LAYER_VERSION = 48;
const THUNDRA_LAYER_ARN =
  "arn:aws:lambda:" +
  process.env.CDK_DEFAULT_REGION +
  ":" +
  THUNDRA_AWS_ACCOUNT_NO +
  ":layer:thundra-lambda-node-layer:" +
  THUNDRA_LAYER_VERSION;

class FileProcessorStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    const sourceBucket = new s3.Bucket(
      this,
      "SourceBucket"
    );
    const targetBucket = new s3.Bucket(
      this,
      "TargetBucket"
    );
    const thundraLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      "ThundraLayer",
      THUNDRA_LAYER_ARN
    );
    const processorFunction = new lambda.Function(
      this,
      "Processor",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: "index.handler",
        environment: {
          TARGET_BUCKET_NAME: targetBucket.bucketName,
          thundra_apiKey: THUNDRA_API_KEY,
        },
        layers: [thundraLayer],
    	   code: lambda.Code.fromAsset(
          path.join(__dirname, "processor-function")
        ),
      }
    );
    sourceBucket.grantRead(processorFunction);
    targetBucket.grantPut(processorFunction);
    const uploadEvent = new lambdaEventSources.S3EventSource(
      sourceBucket,
      { events: [s3.EventType.OBJECT_CREATED] }
    );
    processorFunction.addEventSource(uploadEvent);
  }
}
module.exports = { FileProcessorStack };