@objc(CompanycamVibeCheck)
class CompanycamVibeCheck: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }
//  @objc(getCurrentVibes:withResolver:withRejecter:)
//  func getCurrentVibes() -> Void {
//    resolve();
//  }
}
