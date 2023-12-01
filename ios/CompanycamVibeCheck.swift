@objc(CompanycamVibeCheck)
class CompanycamVibeCheck: NSObject {
    @objc(getThermalState: rejecter:)
    func getThermalState(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
    let state = ProcessInfo.processInfo.thermalState
      resolve(state)
    }
}
