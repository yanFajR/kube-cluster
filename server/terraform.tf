
provider "kubernetes" {
  config_path    = "~/.kube/config"
}


resource "kubernetes_deployment" "kali_linux_0" {
  metadata {
    name = "kali-linux-deployment-0"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "kali-linux-0"
      }
    }

    template {
      metadata {
        labels = {
          app = "kali-linux-0"
        }
      }

      spec {
        container {
          name  = "kali-linux-0"
          image = "undefined"
          resources {
            limits = {
              cpu    = "undefined"
              memory = "undefined"
            }
            requests = {
              cpu    = "undefined"
              memory = "undefined"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_deployment" "postgresql_0" {
  metadata {
    name = "postgresql-deployment-0"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "postgresql-0"
      }
    }

    template {
      metadata {
        labels = {
          app = "postgresql-0"
        }
      }

      spec {
        container {
          name  = "postgresql-0"
          image = "undefined"
          resources {
            limits = {
              cpu    = "undefined"
              memory = "undefined"
            }
            requests = {
              cpu    = "undefined"
              memory = "undefined"
            }
          }
        }
      }
    }
  }
}
