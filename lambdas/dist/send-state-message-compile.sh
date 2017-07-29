export basePath='/Users/karnold/Code/GovHack/slack_app/lambdas'
export functionName='govhack_send_state_message'
export zipLocation=${basePath}'/dist/zips/send-state-message.zip'

zip -j ${zipLocation} ${basePath}/send-state-message/index.js ${basePath}/common/requestHelpers.js ${basePath}/common/slackApiWrapers.js

echo 'Finished create zip file!'

aws lambda update-function-code --function-name ${functionName} --zip-file fileb://${zipLocation}
