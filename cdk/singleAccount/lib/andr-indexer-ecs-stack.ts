import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecr from "@aws-cdk/aws-ecr";
import * as iam from "@aws-cdk/aws-iam";
import * as logs from "@aws-cdk/aws-logs";
import * as servicediscovery from "@aws-cdk/aws-servicediscovery";

export class AndrIndexerEcsStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc, props?: cdk.StackProps) {
    super(scope, id, props);

    const env_name = this.node.tryGetContext('env_name');
    const ENV = String(env_name).toUpperCase();

    const image_tag = this.node.tryGetContext('image_tag');

    // ECS Cluster for Indexer
    const cluster = new ecs.Cluster(this, `andrIndexerCluster${ENV}`, {
      vpc: vpc,
    });

    // Cloud Map Namespace
    const dnsNamespace = new servicediscovery.PrivateDnsNamespace(
      this,
      `DnsNamespace${ENV}`,
      {
        name: `andr-indexer.${ENV}`,
        vpc: vpc,
        description: "Private DnsNamespace for Microservices",
      }
    );

    // Task Role
    const taskrole = new iam.Role(this, "ecsTaskExecutionRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    taskrole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AmazonECSTaskExecutionRolePolicy"
      )
    );

    // Task Definitions
    const andrIndexerServiceTaskDef = new ecs.FargateTaskDefinition(
      this,
      "andrIndexerServiceTaskDef",
      {
        memoryLimitMiB: 1024,
        cpu: 512,
        taskRole: taskrole,
      }
    );

    // const authorServiceTaskDefinition = new ecs.FargateTaskDefinition(
    //   this,
    //   "authorServiceTaskDef",
    //   {
    //     memoryLimitMiB: 512,
    //     cpu: 256,
    //     taskRole: taskrole,
    //   }
    // );

    // Log Groups
    const andrIndexerServiceLogGroup = new logs.LogGroup(this, `andrIndexerServiceLogGroup${ENV}`, {
      logGroupName: `/ecs/andrIndexerService${ENV}`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // const authorServiceLogGroup = new logs.LogGroup(
    //   this,
    //   "authorServiceLogGroup",
    //   {
    //     logGroupName: "/ecs/AuthorService",
    //     removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   }
    // );

    const andrIndexerLogDriver = new ecs.AwsLogDriver({
      logGroup: andrIndexerServiceLogGroup,
      streamPrefix: "andrIndexerService",
    });

    // const authorServiceLogDriver = new ecs.AwsLogDriver({
    //   logGroup: authorServiceLogGroup,
    //   streamPrefix: "AuthorService",
    // });

    const andrIndexerRepoName = this.node.tryGetContext("AWS_ECR_INDEXER_REPO_NAME");
    // Amazon ECR Repositories
    const andrIndexerRepo = ecr.Repository.fromRepositoryName(
      this,
      `andrIndexer${ENV}`,
      andrIndexerRepoName
    );

    // const authorservicerepo = ecr.Repository.fromRepositoryName(
    //   this,
    //   "authorservice",
    //   "author-service"
    // );

    const envConfig = this.node.tryGetContext(ENV + '_INDX');

    // Task Containers
    const andrIndexerContainer = andrIndexerServiceTaskDef.addContainer(
      `andrIndexerContainer${ENV}`,
      {
        image: ecs.ContainerImage.fromEcrRepository(andrIndexerRepo, image_tag),
        logging: andrIndexerLogDriver,
        environment: envConfig
      }
    );

    // const authorServiceContainer = authorServiceTaskDefinition.addContainer(
    //   "authorServiceContainer",
    //   {
    //     image: ecs.ContainerImage.fromEcrRepository(authorservicerepo),
    //     logging: authorServiceLogDriver,
    //   }
    // );

    //Modify when Connor responds
    andrIndexerContainer.addPortMappings({
      containerPort: 4000
    });

    // authorServiceContainer.addPortMappings({
    //   containerPort: 80,
    // });

    //Security Groups
    const andrIndexerServiceSecGrp = new ec2.SecurityGroup(
      this,
      `andrIndexerServiceSecurityGroup${ENV}`,
      {
        allowAllOutbound: true,
        securityGroupName: `andrIndexerServiceSecurityGroup${ENV}`,
        vpc: vpc,
      }
    );

    andrIndexerServiceSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    // const authorServiceSecGrp = new ec2.SecurityGroup(
    //   this,
    //   "authorServiceSecurityGroup",
    //   {
    //     allowAllOutbound: true,
    //     securityGroupName: "authorServiceSecurityGroup",
    //     vpc: vpc,
    //   }
    // );

    // authorServiceSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

    // Fargate Services
    new ecs.FargateService(this, `andrIndexerService${ENV}`, {
      cluster: cluster,
      taskDefinition: andrIndexerServiceTaskDef,
      assignPublicIp: false,
      desiredCount: 1,
      securityGroup: andrIndexerServiceSecGrp,
      cloudMapOptions: {
        name: `andrIndexer${ENV}`,
        cloudMapNamespace: dnsNamespace,
      },
    });

    // const authorService = new ecs.FargateService(this, "authorService", {
    //   cluster: cluster,
    //   taskDefinition: authorServiceTaskDefinition,
    //   assignPublicIp: false,
    //   desiredCount: 2,
    //   securityGroup: authorServiceSecGrp,
    //   cloudMapOptions: {
    //     name: "authorService",
    //     cloudMapNamespace: dnsNamespace,
    //   },
    // });

    // ALB
    // const andrApiInternalALB = new elbv2.ApplicationLoadBalancer(
    //   this,
    //   "andrApiInternalALB",
    //   {
    //     vpc: vpc,
    //     internetFacing: false,
    //   }
    // );

    // ALB Listener
    // this.httpApiListener = andrApiInternalALB.addListener("andrApiListener", {
    //   port: 80,
    //   // Default Target Group
    //   defaultAction: elbv2.ListenerAction.fixedResponse(200),
    // });

    // Target Groups
    // this.httpApiListener.addTargets(
    //   "andrApiServiceTargetGroup",
    //   {
    //     port: 80,
    //     priority: 1,
    //     healthCheck: {
    //       path: "/graphql?query=%7B__typename%7D",
    //       interval: cdk.Duration.seconds(30),
    //       timeout: cdk.Duration.seconds(3),
    //     },
    //     targets: [andrApiService],
    //     pathPattern: "/*",
    //   }
    // );

    // const authorServiceTargetGroup = this.httpApiListener.addTargets(
    //   "authorServiceTargetGroup",
    //   {
    //     port: 80,
    //     priority: 2,
    //     healthCheck: {
    //       path: "/api/authors/health",
    //       interval: cdk.Duration.seconds(30),
    //       timeout: cdk.Duration.seconds(3),
    //     },
    //     targets: [authorService],
    //     pathPattern: "/api/authors*",
    //   }
    // );

    //VPC Link
    // this.httpVpcLink = new cdk.CfnResource(this, "AndrVpcLink", {
    //   type: "AWS::ApiGatewayV2::VpcLink",
    //   properties: {
    //     Name: "andr-api-vpclink",
    //     SubnetIds: vpc.privateSubnets.map((m) => m.subnetId),
    //   },
    // });
  }
}
