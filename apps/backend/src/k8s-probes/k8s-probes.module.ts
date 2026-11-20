import { Module } from '@nestjs/common';
import { K8sProbesController } from './k8s-probes.controller';

@Module({
  controllers: [K8sProbesController]
})
export class K8sProbesModule {}
