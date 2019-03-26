def skipRemainingStages = false
pipeline {
  agent any
  environment {
    CHAT_ID = credentials('chatid')
    TG_TOKEN = credentials('tg_token')
    INTIP = credentials('prod-int-ip')
    USR = credentials('prod-user')
  }
  stages {
    stage('Build') {
      steps {
          script {
            rc = sh(script: "./build.sh", returnStatus: true)
            sh "echo \"exit code is : ${rc}\""
            if (rc != 0)
            {
                sh "echo 'exit code is NOT zero'"
                skipRemainingStages = true
            }
            else
            {
                sh "echo 'exit code is zero'"
            }
          }
      }
    }
    stage('Deploy') {
      when {
                expression { !skipRemainingStages }
      }
      steps {
        withCredentials(bindings: [sshUserPrivateKey(credentialsId: 'jk_dev', keyFileVariable: 'key')]) {
          script {
            rc = sh(script: "./deploy.sh", returnStatus: true)
            sh "echo \"exit code is : ${rc}\""
            if (rc != 0)
            {
                sh "echo 'exit code is NOT zero'"
                skipRemainingStages = true
            }
            else
            {
                sh "echo 'exit code is zero'"
            }
          }
        }
      }
    }
  }
}
