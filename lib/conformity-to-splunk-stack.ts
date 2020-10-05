import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as snsEventSource from '@aws-cdk/aws-lambda-event-sources';

export class ConformityToSplunkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const existingTopicArn = new cdk.CfnParameter(this, "existingTopicArn", {
      type: 'String',
      description: 'The existing SNS topic ARN.',
    });

    const bucket = new s3.Bucket(this, 'conformity-to-splunk-s3', {

    });

    const topic = sns.Topic.fromTopicArn(this, 'conformity-to-splunk-topic', existingTopicArn.valueAsString); 
    const deadLetterQueue = new sqs.Queue(this, 'deadLetterQueue');

    const func = new lambda.Function(this, 'conformity-to-splunk-function', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      environment: {
        'DESTINATION_BUCKET': bucket.bucketName
      },
      code: lambda.Code.fromInline(
        `
        const AWS = require( 'aws-sdk' );
        const S3  = new AWS.S3();
        
        exports.handler = async (event) => {
        
            if (!process.env.DESTINATION_BUCKET) {
                throw "DESTINATION_BUCKET env variable missing";
            }
        
            let message = JSON.parse(event.Records[0].Sns.Message);
                message = [message]; // keep the format as Array so the file format can cater for multiple checks
                message = JSON.stringify(message, null, 2);
        
            const params = {
                 Bucket: process.env.DESTINATION_BUCKET,
                 Key: \`` + '${Date.now()}' + `.json\`,
                 Body: message
            };
        
            return S3.putObject(params).promise();
        
        };
        
        `
      )
    });
    func.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:PutObject',
        's3:PutBucketAcl'
      ],
      resources: [
        `arn:aws:s3:::${bucket.bucketName}`,
        `arn:aws:s3:::${bucket.bucketName}/*`
      ]
    }));
    func.addEventSource(new snsEventSource.SnsEventSource(topic, {
      deadLetterQueue: deadLetterQueue
    }));

    new cdk.CfnOutput(this, "BucketForSplunkIntegration", {
      value: bucket.bucketName,
      description: 'Bucket name to be used for Splunk integration'
    });
  }
}
