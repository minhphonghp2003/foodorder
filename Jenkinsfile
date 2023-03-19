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
               cp /home/ubuntu/.env/foodorder .env
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
                sh 'docker rmi $(docker images --filter "dangling=true" -q --no-trunc)'
             sh 'docker run -dp 80:3000 --name foodorder -v /home/ubuntu/.env/foodorder:/app/.env minhphonghp2003/foodorder:latest'

            }
        }
    }
    post {
        cleanup {
            /* clean up our workspace */
            deleteDir()
            /* clean up tmp directory */
            dir("${workspace}@tmp") {
                deleteDir()
            }
            /* clean up script directory */
            dir("${workspace}@script") {
                deleteDir()
            }
        }
    }
}
