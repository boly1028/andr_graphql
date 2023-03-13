import * as cdk from "@aws-cdk/core";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as apig from "@aws-cdk/aws-apigatewayv2";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2";

export class AndrHttpApiStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    vpc: ec2.Vpc,
    httpVpcLink: cdk.CfnResource,
    httpApiListener: elbv2.ApplicationListener,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const env_name = this.node.tryGetContext('env_name');
    const ENV = String(env_name).toUpperCase();
    this.node.tryGetContext(ENV);

    //Security Group
    const bastionSecGrp = new ec2.SecurityGroup(this, `bastionSecGrp${ENV}`, {
      allowAllOutbound: true,
      securityGroupName: `bastionSecGrp${ENV}`,
      vpc: vpc,
    });

    bastionSecGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(22));

    // AMI
    const amz_linux = ec2.MachineImage.latestAmazonLinux({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: ec2.AmazonLinuxEdition.STANDARD,
      virtualization: ec2.AmazonLinuxVirt.HVM,
      storage: ec2.AmazonLinuxStorage.GENERAL_PURPOSE,
    });

    // Instance
    const instance = new ec2.Instance(this, "BastionHost", {
      instanceType: new ec2.InstanceType("t3.nano"),
      machineImage: amz_linux,
      vpc: vpc,
      securityGroup: bastionSecGrp,
      // keyName: "ssh-key",
    });

    // HTTP API
    const api = new apig.HttpApi(this, `andrHttpApigw${ENV}`, {
      createDefaultStage: true,
      description: `HTTP API for ANDR ${ENV} instace with CORS enabled`,
      // corsPreflight: {
      //   allowHeaders: [
      //     'Content-Type',
      //     'X-Amz-Date',
      //     'Authorization',
      //     'X-Api-Key',
      //   ],
      //   allowMethods: [
      //     CorsHttpMethod.OPTIONS,
      //     CorsHttpMethod.GET,
      //     CorsHttpMethod.POST,
      //     CorsHttpMethod.PUT,
      //     CorsHttpMethod.PATCH,
      //     CorsHttpMethod.DELETE,
      //   ],
      //   allowCredentials: true,
      //   //allowOrigins: [envConfig.FRONTEND_BASE_URL],
      //   // 👇 optionally cache responses to preflight requests
      //   maxAge: cdk.Duration.minutes(5),
      // },
    });

    // API Integration
    const integration = new apig.CfnIntegration(
      this,
      `andrHttpApiGatewayIntegration${ENV}`,
      {
        apiId: api.httpApiId,
        connectionId: httpVpcLink.ref,
        connectionType: "VPC_LINK",
        description: "API Integration",
        integrationMethod: "ANY",
        integrationType: "HTTP_PROXY",
        integrationUri: httpApiListener.listenerArn,
        payloadFormatVersion: "1.0",
      }
    );

    // API Route
    new apig.CfnRoute(this, "Route", {
      apiId: api.httpApiId,
      routeKey: "ANY /{proxy+}",
      target: `integrations/${integration.ref}`,
    });

    // EC2 instance ip address
    new cdk.CfnOutput(this, "EC2 public ip address: ", {
      value: instance.instancePublicIp,
    });

    // API and Service Endpoints
    const httpApiEndpoint = api.apiEndpoint;
    const graphqlServiceEndpoint = httpApiEndpoint + "/graphql";
    
    new cdk.CfnOutput(this, "HTTP API endpoint: ", {
      value: httpApiEndpoint,
    });
    new cdk.CfnOutput(this, "GraphQL Service: ", {
      value: graphqlServiceEndpoint,
    });
  }
}
