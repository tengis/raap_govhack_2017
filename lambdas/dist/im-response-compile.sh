export basePath='/Users/karnold/Code/GovHack/slack_app/lambdas'
export functionName='govhack_channel_event'
export zipLocation=${basePath}'/dist/zips/im-response.zip'

zip -j ${zipLocation} ${basePath}/im-response/index.js ${basePath}/common/requestHelpers.js ${basePath}/common/slackApiWrapers.js

echo 'Finished create zip file!'

aws lambda update-function-code --function-name ${functionName} --zip-file fileb://${zipLocation}
