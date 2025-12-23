pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
        DOCKERHUB_USERNAME = credentials('dockerhub-username')
        DOCKERHUB_TOKEN = credentials('dockerhub-token')
    }

    options {
        disableConcurrentBuilds()   // לא להריץ כמה בילדים במקביל
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node') {
            steps {
                sh '''
                  node -v || curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                  npm -v
                '''
            }
        }

        // ===== CLIENT =====
        stage('Client - Install & Build') {
            steps {
                dir('client') {
                    sh '''
                      npm install
                      npm run lint || true
                      npm run build
                    '''
                }
            }
        }

        // ===== SERVER =====
        stage('Server - Install & Test') {
            steps {
                dir('server') {
                    sh '''
                      npm install
                      npm test
                    '''
                }
            }
        }

        // ===== DOCKER =====
        stage('Docker Login') {
            steps {
                sh '''
                  echo $DOCKERHUB_TOKEN | docker login -u $DOCKERHUB_USERNAME --password-stdin
                '''
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                sh '''
                  docker build -t $DOCKERHUB_USERNAME/myapp-client:latest ./client
                  docker push $DOCKERHUB_USERNAME/myapp-client:latest

                  docker build -t $DOCKERHUB_USERNAME/myapp-server:latest ./server
                  docker push $DOCKERHUB_USERNAME/myapp-server:latest
                '''
            }
        }

        stage('Docker Compose Validation') {
            steps {
                sh '''
                  docker compose build
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}
