package com.yintrack.backend.config;

import com.twilio.Twilio;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    public TwilioConfig(
        @Value("${app.twilio.account-sid}") String accountSid,
        @Value("${app.twilio.auth-token}") String authToken
    ) {
        if (accountSid != null && !accountSid.isBlank() && authToken != null && !authToken.isBlank()) {
            Twilio.init(accountSid, authToken);
        }
    }
}
