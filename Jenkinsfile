pipeline {
    agent any
    triggers {
        githubPush()
    }

    stages {
        stage('Build') {
            steps {
                script {
                    // Membangun image Docker
                    sh 'docker build -t aditbest5/backend-sosmed .'
                }
            }
        }

        stage('Deliver') {
            steps {
                script {
                    // Menghentikan dan menghapus container yang berjalan, jika ada
                    sh 'docker container stop backend-sosmed-container || true'
                    sh 'docker container rm backend-sosmed-container || true'
                    
                    // Menjalankan container baru dalam mode detached (-d)
                    sh 'docker run -d --name backend-sosmed-container -p 5000:5000 aditbest5/backend-sosmed'
                }
            }
        }
    }

    post {
        always {
            script {
                // Membersihkan image yang tidak digunakan
                sh 'docker image prune -f || true'
            }
        }
    }
}