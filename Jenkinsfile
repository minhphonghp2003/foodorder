pipeline {
  agent any
  stages {
    stage('install dep') {
      parallel {
        stage('install dep') {
          steps {
            sh 'npm i'
          }
        }

        stage('dummy step') {
          steps {
            echo 'dummy step msg'
            sh 'ls -la && id && env'
          }
        }

      }
    }

  }
}