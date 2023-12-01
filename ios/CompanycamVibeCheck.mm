#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CompanycamVibeCheck, NSObject)

RCT_EXTERN_METHOD(getThermalState: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
