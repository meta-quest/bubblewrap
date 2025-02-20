/*
 * (c) Meta Platforms, Inc. and affiliates.
 */

import {EmptyFeature} from './EmptyFeature';

export type HorizonPlatformSDKConfig = {
    enabled: boolean;
}

export class HorizonPlatformSDKFeature extends EmptyFeature {
  constructor() {
    super('HorizonPlatformSDK');
    this.buildGradle.dependencies.push('com.meta.androidbrowserhelper:horizonpermissions:1.0.0');
    this.delegationService.imports.push('com.meta.androidbrowserhelper.horizonpermissions.PermissionRequestExtraCommandHandler');
    this.delegationService.onCreate =
        'registerExtraCommandHandler(new PermissionRequestExtraCommandHandler());';

    this.buildGradle.dependencies.push('com.meta.androidbrowserhelper:horizonplatformsdk:1.1.0');
    this.delegationService.imports.push('com.meta.androidbrowserhelper.horizonplatformsdk.HorizonPlatformSdkRequestHandler');
    this.delegationService.onCreate +=
        '\n            registerExtraCommandHandler(new HorizonPlatformSdkRequestHandler(getApplicationContext()));';
  }
}
