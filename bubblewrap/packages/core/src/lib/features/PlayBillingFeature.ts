/*
 * Copyright 2020 Google Inc. All Rights Reserved.
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

import {EmptyFeature} from './EmptyFeature';

export type PlayBillingConfig = {
    enabled: boolean;
}

export class PlayBillingFeature extends EmptyFeature {
  constructor() {
    super('playbilling');

    this.buildGradle.dependencies.push('com.google.androidbrowserhelper:billing:1.0.0-alpha11');

    this.androidManifest.components.push(`
        <activity
            android:name="com.google.androidbrowserhelper.playbilling.provider.PaymentActivity"
            android:theme="@android:style/Theme.Translucent.NoTitleBar"
            android:configChanges="keyboardHidden|keyboard|orientation|screenLayout|screenSize"
            android:exported="true">

            <intent-filter>
                <action android:name="org.chromium.intent.action.PAY" />
            </intent-filter>

            <meta-data
                android:name="org.chromium.default_payment_method_name"
                android:value="https://play.google.com/billing" />
        </activity>

        <!-- This service checks who calls it at runtime. -->
        <service
            android:name="com.google.androidbrowserhelper.playbilling.provider.PaymentService"
            android:exported="true" >
            <intent-filter>
                <action android:name="org.chromium.intent.action.IS_READY_TO_PAY" />
            </intent-filter>
        </service> `);

    this.delegationService.imports.push(
        'com.google.androidbrowserhelper.playbilling.digitalgoods.DigitalGoodsRequestHandler');
    this.delegationService.onCreate =
        'registerExtraCommandHandler(new DigitalGoodsRequestHandler(getApplicationContext()));';
  }
}
