grunt build
aws s3 sync ./dist/ s3://oficinaapp --acl public-read
rm -rf dist/*
