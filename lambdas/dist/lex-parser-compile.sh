export basePath='/Users/karnold/Code/GovHack/slack_app/lambdas'
# export functionName='govhack_send_state_message'
export zipLocation=${basePath}'/dist/zips/lex-parser.zip'

# zip -j ${zipLocation} ${basePath}/send-state-message/index.js ${basePath}/common/requestHelpers.js ${basePath}/common/slackApiWrapers.js

# echo 'Finished create zip file!'

# aws lambda update-function-code --function-name ${functionName} --zip-file fileb://${zipLocation}

rm -rf /tmp/dummy_zip
mkdir /tmp/dummy_zip

cp ${basePath}/lex-parser/index.js /tmp/dummy_zip/
cp ${basePath}/common/raapWrapper.js /tmp/dummy_zip/
cp -R ${basePath}/node_modules /tmp/dummy_zip/

rm ${zipLocation}
cd /tmp/dummy_zip/
zip -r ${zipLocation} .

echo 'Finished create zip file!'

# aws lambda update-function-code --function-name ${functionName} --zip-file fileb://${zipLocation}
