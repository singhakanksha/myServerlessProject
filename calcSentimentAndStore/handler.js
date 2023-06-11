const AWS = require('aws-sdk');
const axios = require('axios');

// Create a DynamoDB service object
const dynamodb = new AWS.DynamoDB.DocumentClient();

// This lambda grabs today's headlines, does sentiment analysis using AWS Comprehend,
// and saves the news along with sentiment into a DynamoDB table
module.exports.hello = async (event, context) => {
  console.log('button pressed');
  console.log(event);
  console.log('just changing a printing');

  if (event.action === 'insert news') {
    await findNews();
  } else {
    await deleteNews();
  }

  return 'End of News Sentiment IOT function';
};

async function deleteNews() {
  const params = {
    TableName: 'news'
  };

  try {
    const response = await dynamodb.scan(params).promise();

    if (response.Items) {
      for (const row of response.Items) {
        const sentiment = row.sentiment;
        const timestamp = row.timestamp;

        await dynamodb
          .delete({
            TableName: 'news',
            Key: {
              sentiment: sentiment,
              timestamp: timestamp
            }
          })
          .promise();
      }
    }
  } catch (error) {
    console.error('Error deleting news:', error);
  }
}
async function findNews() {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=d2ff396ccf8e410c8719b19196fc6e3b');

    if (response.data.status === 'ok') {
      for (const article of response.data.articles) {
        console.log("------->>>>>>>>>>>>>>>>>>.")
        console.log(article.title);
        console.log("------->>>>>>>>>>>>>>>>>>.")
        const newsTitle = article.title;
        const timestamp = article.publishedAt;
        const sentiment = JSON.parse(await getSentiment(newsTitle));

        console.log(sentiment.Sentiment);
        await insertDynamo(sentiment.Sentiment, newsTitle, timestamp);
      }
    }
  } catch (error) {
    console.error('Error finding news:', error);
  }
}
async function getSentiment(newsTitle) {
  const comprehend = new AWS.Comprehend();

  try {
    const response = await comprehend
      .detectSentiment({
        Text: newsTitle,
        LanguageCode: 'en'
      })
      .promise();

    return JSON.stringify(response, null, 2);
  } catch (error) {
    console.error('Error getting sentiment:', error);
    return '{}';
  }
}
async function insertDynamo(sentiment, newsTitle, timestamp) {
  const params = {
    TableName: 'news',
    Item: {
      sentiment: sentiment,
      title: newsTitle,
      timestamp: timestamp
    }
  };

  try {
    await dynamodb.put(params).promise();
    console.log('News inserted into DynamoDB');
  } catch (error) {
    console.error('Error inserting news:', error);
  }
}
