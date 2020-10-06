# Conformity-to-S3

Conformity-to-S3 is a CDK project to deploy all the required resources to move data from Conformity to S3, enabling further integration with other services, such as Splunk.

## Deployment

Just want to run it? The latest version of the CloudFormation template is always available [here](https://github.com/raphabot/Conformity-to-S3/releases/latest/download/ConformityToS3Stack.template.json).

## Outputs

* `EventsBucket`   Bucket name that hosts all events
* `TopicARN`   SNS Topic ARN to be used in Conformity dashboard

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## License
[MIT](https://choosealicense.com/licenses/mit/)