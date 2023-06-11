# myServerlessProject
A repository that shows how to build a small serverless project using aws apigateway, lambdas, comprehend. It also uses `artillery` for performance testing and uses `failure-lambda` for serverless chaos testing

<h2>architecture of the project</h2> 

<img width="898" alt="Screenshot 2023-06-09 at 7 22 32 AM" src="https://github.com/singhakanksha/myServerlessProject/assets/6916097/a6bf7a37-0cf4-47f0-b323-5fde83c1d314">

<h3>command to run performance testing</h3>
1. artillery run comprehendPerformance.yml

<h3>command to run chaos testing</h3>

1. to inject failureMode be denylist: 
```json
aws ssm put-parameter --region us-east-1 --name failureLambdaConfig --type String --overwrite --value '{"isEnabled": false, "failureMode": "denylist", "rate": 1, "minLatency": 100, "maxLatency": 400, "exceptionMsg": "Exception message!", "statusCode": 404, "diskSpace": 100, "denylist": ["s3.*.amazonaws.com", "dynamodb.*.amazonaws.com"]}'
```


2. to inject failureMode be exception:
```json
aws ssm put-parameter --region us-east-1 --name failureLambdaConfig --type String --overwrite --value '{"isEnabled": true, "failureMode": "exception", "rate": 1, "minLatency": 100, "maxLatency": 400, "exceptionMsg": "Exception message!", "statusCode": 404, "diskSpace": 100, "denylist": ["s3.*.amazonaws.com", "dynamodb.*.amazonaws.com"]}'
```

3. to inject failureMode be statuscode:
```json
aws ssm put-parameter --region us-east-1 --name failureLambdaConfig --type String --overwrite --value '{"isEnabled": true, "failureMode": "statuscode", "rate": 1, "minLatency": 100, "maxLatency": 400, "exceptionMsg": "Exception message!", "statusCode": 404, "diskSpace": 100, "denylist": ["s3.*.amazonaws.com", "dynamodb.*.amazonaws.com"]}'
```

4. to inject failureMode be latency
```json
aws ssm put-parameter --region us-east-1 --name failureLambdaConfig --type String --overwrite --value '{"isEnabled": true, "failureMode": "latency", "rate": 1, "minLatency”:100, "maxLatency": 7000, "exceptionMsg": "Exception message!", "statusCode": 404, "diskSpace": 100, "denylist": ["s3.*.amazonaws.com", "dynamodb.*.amazonaws.com"]}'     
```
