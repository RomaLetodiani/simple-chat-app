echo "Logging in to ECR"
aws ecr get-login-password --region eu-west-1 --profile supernova | docker login --username AWS --password-stdin 335173025468.dkr.ecr.eu-west-1.amazonaws.com
echo "Building"
docker build -t chat-demo-api .
echo "Tagging"
docker tag chat-demo-api:latest 335173025468.dkr.ecr.eu-west-1.amazonaws.com/chat-demo-api:latest
echo "Pushing"
docker push 335173025468.dkr.ecr.eu-west-1.amazonaws.com/chat-demo-api:latest
echo "Updating service"
aws ecs update-service --cluster pulsar-cluster-test --service chat-demo-api --force-new-deployment --region eu-west-1 --profile supernova > /dev/null 2>&1

echo "Done"