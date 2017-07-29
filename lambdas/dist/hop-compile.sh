export basePath='/Users/karnold/Code/GovHack/slack_app/lambdas'
export functionName='govhack_slack_hop'
export zipLocation=${basePath}'/dist/zips/hop.zip'

zip -j ${zipLocation} ${basePath}/hop/index.js ${basePath}/common/requestHelpers.js ${basePath}/common/slackApiWrapers.js

echo 'Finished create zip file!'

aws lambda update-function-code --function-name ${functionName} --zip-file fileb://${zipLocation}
