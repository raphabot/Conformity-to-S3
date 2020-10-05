#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ConformityToSplunkStack } from '../lib/conformity-to-splunk-stack';

const app = new cdk.App();
new ConformityToSplunkStack(app, 'ConformityToSplunkStack');
