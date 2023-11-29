@objc(CompanycamVibeCheck)
class CompanycamVibeCheck: NSObject {

  @objc(multiply:withB:withResolver:withRejecter:)
  func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    resolve(a*b)
  }
    
    @objc(getThermalState: rejecter:)
    func getThermalState(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    let state = ProcessInfo.processInfo.thermalState
      resolve(state)
    }
}
