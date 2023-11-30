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

  func mach_task_self() -> task_t {
    return mach_task_self_
  }

  func getMemoryUsedInBytesUsed() -> Float? {
    var info = mach_task_basic_info()
    var count = mach_msg_type_number_t(MemoryLayout.size(ofValue: info) / MemoryLayout<integer_t>.size)
    let kerr = withUnsafeMutablePointer(to: &info) { infoPtr in
        return infoPtr.withMemoryRebound(to: integer_t.self, capacity: Int(count)) { (machPtr: UnsafeMutablePointer<integer_t>) in
            return task_info(
                mach_task_self(),
                task_flavor_t(MACH_TASK_BASIC_INFO),
                machPtr,
                &count
            )
        }
    }
    guard kerr == KERN_SUCCESS else {
        return nil
    }  
    return Float(info.resident_size)
  }

  @objc(getMemoryInfo: rejecter:)
  func getMemoryInfo(resolve:RCTPromiseResolveBlock, reject:RCTPromiseRejectBlock) -> Void {
    let unformattedMemoryUsed = getMemoryUsedInBytesUsed()
    let formattedMemoryUsed: String
    if (unformattedMemoryUsed != nil) {
        formattedMemoryUsed = String(format: "%f", unformattedMemoryUsed!)
    } else {
        formattedMemoryUsed = "unable to get memory value"
    }
    resolve(formattedMemoryUsed);

  }
}
