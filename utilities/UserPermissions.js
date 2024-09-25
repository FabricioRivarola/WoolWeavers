import Constants from "expo-constants"
import * as Permissions from "expo-permissions"

class UserPermissions {
    getCameraPermission = async () => {
        if (Constants.platform.android){
            const {status} = await Permissions.askAsync(Permissions.CAMERA);

            if(status != "granted"){
                alert("Se requiere permisos para acceder a tus fotos")
            }
        }
    }
}

export default new UserPermissions();