/*
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Copyright 2024 Meta Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { HorizonOSAppMode } from '../TwaManifest';
import {EmptyFeature} from './EmptyFeature';

export type HorizonBillingConfig = {
    enabled: boolean;
    horizonOSAppMode: HorizonOSAppMode;
}

export class HorizonBillingFeature extends EmptyFeature {
    constructor(config: HorizonBillingConfig) {
    super('horizonbilling');

    this.buildGradle.dependencies.push('com.meta.androidbrowserhelper:horizonbilling:1.0.0-alpha11');

        const category = config.horizonOSAppMode == '2D' ? '' : '<category android:name="com.oculus.intent.category.VR" />';

        this.androidManifest.components.push(`
        <activity
            android:name="com.meta.androidbrowserhelper.horizonbilling.provider.PaymentActivity"
            android:theme="@android:style/Theme.Translucent.NoTitleBar"
            android:configChanges="keyboardHidden|keyboard|orientation|screenLayout|screenSize"
            android:exported="true">

            <intent-filter>
                <action android:name="org.chromium.intent.action.PAY" />
                ${category}
            </intent-filter>

            <meta-data
                android:name="org.chromium.default_payment_method_name"
                android:value="https://quest.meta.com/billing" />
        </activity>

        <!-- This service checks who calls it at runtime. -->
        <service
            android:name="com.meta.androidbrowserhelper.horizonbilling.provider.PaymentService"
            android:exported="true" >
            <intent-filter>
                <action android:name="org.chromium.intent.action.IS_READY_TO_PAY" />
            </intent-filter>
        </service> `);

    this.delegationService.imports.push(
        'com.meta.androidbrowserhelper.horizonbilling.digitalgoods.DigitalGoodsRequestHandler');
    this.delegationService.onCreate =
        'registerExtraCommandHandler(new DigitalGoodsRequestHandler(getApplicationContext()));';
    this.androidManifest.permissions.push(
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE',
        'android.permission.ACCESS_WIFI_STATE');
  }
}
