pipeline {
    agent any
    tools {
  nodejs 'jenkins'
   
}

    stages {
        stage('Build') {
           
             steps {
              checkout scmGit(branches: [[name: '*/main']], extensions: [], userRemoteConfigs: [[url: 'https://github.com/minhphonghp2003/foodorder']])
              sh 'npm i'
            }
           
        }
        stage("Testing"){
            steps{
               
                sh "npm test"
            }
            
        }
        stage("Push to Dockerhub"){
            steps{
             withDockerRegistry(credentialsId: 'dockerhub', url: 'https://index.docker.io/v1/') {
    sh 'docker build -t minhphonghp2003/foodorder:latest .'
    sh 'docker push minhphonghp2003/foodorder:latest'
}
            }
        }
        stage("Re-Deploy"){
            steps{
             sh 'docker stop foodorder && docker rm foodorder'
             sh 'docker run -dp 80:3000 --name foodorder -v $(pwd)/.env:/app/.env minhphonghp2003/foodorder:latest'

            }
        }
    }
}
