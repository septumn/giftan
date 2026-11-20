import { Controller, Get } from '@nestjs/common';

@Controller('k8s-probes')
export class K8sProbesController {
  @Get('readyz')
  readiness() {
    return
  }

  @Get('healthz')
  liveness() {
    return
  }
}