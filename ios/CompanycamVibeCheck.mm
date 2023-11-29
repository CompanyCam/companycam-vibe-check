#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CompanycamVibeCheck, NSObject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

// RCT_EXTERN_METHOD(getThermalState) {
//   return @"omfg";
// }

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
