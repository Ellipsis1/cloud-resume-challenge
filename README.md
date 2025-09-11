# Cloud Resume Challenge

A serverless resume website built on AWS, featuring a visitor counter powered by DynamoDB and Java Lambda functions. This project demonstrates cloud architecture, infrastructure as code, and CI/CD best practices.

##  Live Demo

**Website**: [bluellipsis.com](https://bluellipsis.com)  
**API Endpoint**: [https://6xq40rciya.execute-api.us-east-1.amazonaws.com/prod/visitor-count](https://6xq40rciya.execute-api.us-east-1.amazonaws.com/prod/visitor-count)

##  Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   CloudFront    │    │ API Gateway  │    │ Lambda Function │
│   (CDN + SSL)   │◄───┤              │◄───┤   (Java 17)     │
└─────────────────┘    └──────────────┘    └─────────────────┘
         │                                           │
         ▼                                           ▼
┌─────────────────┐                         ┌─────────────────┐
│   S3 Bucket     │                         │   DynamoDB      │
│ (Static Files)  │                         │ (Visitor Count) │
└─────────────────┘                         └─────────────────┘
         │
         ▼
┌─────────────────┐
│   Route 53      │
│ (DNS + Domain)  │
└─────────────────┘
```

##  Technologies Used

### Frontend
- **HTML5/CSS3** - Responsive design with modern styling
- **JavaScript (ES6+)** - Async/await API calls, DOM manipulation
- **AWS S3** - Static website hosting
- **CloudFront** - Global CDN with SSL/TLS

### Backend
- **Java 17** - Lambda function runtime
- **Maven** - Build and dependency management
- **AWS Lambda** - Serverless compute
- **DynamoDB** - NoSQL database for visitor counter
- **API Gateway** - REST API with CORS support

### Infrastructure & DevOps
- **AWS Route 53** - DNS management
- **GitHub Actions** - CI/CD pipeline
- **Infrastructure as Code** - AWS services configuration

##  Project Structure

```
cloud-resume-challenge/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── frontend/
│   ├── index.html              # Resume content
│   ├── style.css               # Responsive styling
│   └── script.js               # Visitor counter logic
├── backend/
│   ├── pom.xml                 # Maven dependencies
│   └── src/main/java/
│       └── com/bluellipsis/resume_api/
│           └── VisitorCounterHandler.java
└── README.md
```

##  Features

- **Responsive Design** - Mobile-first approach with modern CSS
- **Real-time Visitor Counter** - DynamoDB-backed with atomic increments
- **Fast Global Delivery** - CloudFront CDN with edge caching
- **Secure HTTPS** - SSL/TLS certificates via AWS Certificate Manager
- **Automated Deployments** - GitHub Actions CI/CD pipeline
- **RESTful API** - Clean API design with proper error handling
- **Cost Optimized** - Serverless architecture within AWS Free Tier

##  Local Development

### Prerequisites
- Java 17
- Maven 3.6+
- AWS CLI configured
- Node.js (for frontend testing)


##  CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **Test Phase**
    - Runs Java unit tests
    - Validates code compilation
    - Caches Maven dependencies

2. **Deploy Frontend**
    - Syncs static files to S3
    - Invalidates CloudFront cache
    - Updates website instantly

3. **Deploy Backend**
    - Builds optimized JAR file
    - Updates Lambda function code
    - Verifies deployment success

4. **Integration Testing**
    - Tests API endpoint functionality
    - Validates website accessibility
    - Ensures end-to-end functionality

##  API Documentation

### Increment Visitor Count
```http
POST /prod/visitor-count
```

**Response:**
```json
{
  "statusCode": 200,
  "body": "{\"count\":42,\"action\":\"increment\",\"timestamp\":1757562003171}"
}
```

## 🔒 Security

- **HTTPS Only** - All traffic encrypted via CloudFront
- **CORS Configured** - Proper cross-origin resource sharing
- **IAM Permissions** - Least privilege access for Lambda
- **Input Validation** - Sanitized API requests

## 💰 Cost Analysis

Monthly costs (estimated):
- **S3 Storage**: ~$0.01 (static files)
- **Lambda Invocations**: $0.00 (Free Tier: 1M requests)
- **DynamoDB**: $0.00 (Free Tier: 25GB storage)
- **CloudFront**: ~$0.50 (data transfer)
- **Route 53**: $0.50 (hosted zone)

**Total**: ~$1.01/month

##  Learning Outcomes

This project demonstrates proficiency in:

- **Cloud Architecture** - Multi-service AWS integration
- **Serverless Computing** - Lambda function development
- **Infrastructure as Code** - Automated resource provisioning
- **CI/CD Practices** - Automated testing and deployment
- **RESTful API Design** - Clean, documented endpoints
- **Frontend Development** - Modern JavaScript and responsive design
- **Database Operations** - NoSQL data modeling and atomic updates
- **DevOps Workflows** - Git-based deployment pipelines

##  Related Links

- [Cloud Resume Challenge](https://cloudresumechallenge.dev/) - Original challenge description
- [AWS Lambda Java Documentation](https://docs.aws.amazon.com/lambda/latest/dg/java-handler.html)
- [AWS Free Tier](https://aws.amazon.com/free/) - Cost optimization details

##  License

This project is open source and available under the [MIT License](LICENSE).

---

**Built by Justin Hendershot** | [LinkedIn](https://www.linkedin.com/in/justin-hendershot-92b5391aa) | [Resume](https://bluellipsis.com)