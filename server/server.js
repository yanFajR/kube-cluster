const express = require('express');
const bodyParser = require('body-parser');
const { execSync } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.json());

async function deployWithTerraform(kaliLinux, postgresql) {
    console.log('Deploying Kubernetes resources with Terraform...');
    try {
        let terraformConfig = `
provider "kubernetes" {
  config_path    = "~/.kube/config"
}

`;

        kaliLinux.instances.forEach((instance, index) => {
            terraformConfig += `
resource "kubernetes_deployment" "kali_linux_${index}" {
  metadata {
    name = "kali-linux-deployment-${index}"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "kali-linux-${index}"
      }
    }

    template {
      metadata {
        labels = {
          app = "kali-linux-${index}"
        }
      }

      spec {
        container {
          name  = "kali-linux-${index}"
          image = "${instance.image}"
          resources {
            limits = {
              cpu    = "${instance.cpu}"
              memory = "${instance.memory}"
            }
            requests = {
              cpu    = "${instance.cpu}"
              memory = "${instance.memory}"
            }
          }
        }
      }
    }
  }
}
`;
        });

        postgresql.instances.forEach((instance, index) => {
            terraformConfig += `
resource "kubernetes_deployment" "postgresql_${index}" {
  metadata {
    name = "postgresql-deployment-${index}"
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "postgresql-${index}"
      }
    }

    template {
      metadata {
        labels = {
          app = "postgresql-${index}"
        }
      }

      spec {
        container {
          name  = "postgresql-${index}"
          image = "${instance.image}"
          resources {
            limits = {
              cpu    = "${instance.cpu}"
              memory = "${instance.memory}"
            }
            requests = {
              cpu    = "${instance.cpu}"
              memory = "${instance.memory}"
            }
          }
        }
      }
    }
  }
}
`;
        });

        require('fs').writeFileSync('terraform.tf', terraformConfig);

        execSync('terraform init');
        execSync('terraform apply -auto-approve');

        console.log('Kubernetes resources deployed successfully.');

        const response = { message: 'Kubernetes resources deployed successfully.' };
        return response;
    } catch (error) {
        console.error('Error deploying Kubernetes resources with Terraform:', error);
        throw error;
    }
}

app.post('/deploy', async (req, res) => {
    const { kaliLinux, postgresql } = req.body;
    try {
        const response = await deployWithTerraform(kaliLinux, postgresql);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error deploying Kubernetes resources.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
