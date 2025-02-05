// Portions (c) Meta Platforms, Inc. and affiliates.
package <%= packageId %>;

<% for(const imp of delegationService.imports) { %>
import <%= imp %>;
<% } %>

public class DelegationService extends
        com.meta.androidbrowserhelper.trusted.DelegationService {
    @Override
    public void onCreate() {
        super.onCreate();

        <% for(const code of delegationService.onCreate) { %>
            <%= code %>
        <% } %>
    }
}

