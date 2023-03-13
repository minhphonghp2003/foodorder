pipeline {
    agent any
//     tools {
//   nodejs 'jenkins'
   
// }

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
        stage("Deploy"){
            steps{
             withDockerRegistry(credentialsId: 'f48a4f26-b83c-4e54-a1f3-cb2161583a58', url: 'https://index.docker.io/v1/') {
    sh 'docker build -t minhphonghp2003/foodorder:latest .'
    sh 'docker push minhphonghp2003/foodorder:latest'
}
            }
        }
    }
}
