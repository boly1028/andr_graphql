import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";

export class AndrVpcStack extends cdk.Stack {
    //Export producer and consumer VPC
    public readonly producerVPC: ec2.Vpc;
    public readonly consumerVPC: ec2.Vpc;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Producer VPC
        this.producerVPC = new ec2.Vpc(this, "AndrProducerVPC");

        // Consumer VPC
        this.consumerVPC = new ec2.Vpc(this, "AndrConsumerVPC", {
            natGateways: 0,
            subnetConfiguration: [
            {
                cidrMask: 24,
                name: "ingress",
                subnetType: ec2.SubnetType.PUBLIC,
            },
            ],
        });
    }
}
