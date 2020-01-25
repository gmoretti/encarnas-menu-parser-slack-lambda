# encarnas-menu-parser-slack-lambda
![deploy to lambda](https://github.com/gmoretti/encarnas-menu-parser-slack-lambda/workflows/deploy%20to%20lambda/badge.svg)

Lambdad that scraps some data from a website and sends the info back trought Slack.

## Configuration

This is a lambda function in NodeJS. Is expected to have an **environment variable SLACK_TOKEN** 
configured in the lambda function with the token provided by the Slack App.
