#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AndrHttpApiStack } from '../lib/andr-httpApi-stack';
import { AndrVpclinkEcsStack } from '../lib/andr-vpc-link-ecs-stack';
import { AndrVpcStack } from '../lib/andr-vpc-stack';

const envUSA = { region: 'us-west-2' };

const app = new cdk.App();
const env_name = app.node.tryGetContext('env_name')
const ENV = String(env_name).toUpperCase();

const rtbVpcStack = new AndrVpcStack(app, "AndrVpcStack", { env: envUSA });
const rtbVpclinkEcsStack = new AndrVpclinkEcsStack(app, `AndrFargateVpclinkStack${ENV}`, rtbVpcStack.producerVPC, { env: envUSA });
new AndrHttpApiStack(app, `AndrHttpApiStack${ENV}`, rtbVpcStack.consumerVPC, rtbVpclinkEcsStack.httpVpcLink, rtbVpclinkEcsStack.httpApiListener , { env: envUSA });
