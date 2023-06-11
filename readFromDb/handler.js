const failureLambda = require('failure-lambda')
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();


process.env['FAILURE_INJECTION_PARAM'] = "failureLambdaConfig"; 

module.exports.funtwo = failureLambda(async (event, context) => {
  // TODO implement
  const tableName = 'news';
  const inputSentiment = event.sentiment;

  try {
    // Querying the table using Primary key
    const params = {
      TableName: tableName,
      KeyConditionExpression: 'sentiment = :sentiment',
      ExpressionAttributeValues: {
        ':sentiment': inputSentiment
      },
      Limit: 10,
      ScanIndexForward: false
    };

    const response = await dynamodb.query(params).promise();

    return response;
  } catch (error) {
    throw error;
  }
});






