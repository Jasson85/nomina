from fastapi import Depends, HTTPException, status
from app.services.auth_service import AuthService 
from app.database.models import Usuario, RolUsuario 

def requires_role(required_roles: list[RolUsuario]):
    # Esta es la dependencia interna que FastAPI llama
    def role_verifier(current_user: Usuario = Depends(AuthService.get_current_user)):
        
        user_role_value = current_user.rol.value        
        
        required_roles_values = [r.value for r in required_roles]

        # 3. Verificar si el rol del usuario (cadena) está en la lista de roles permitidos (cadenas)
        if user_role_value not in required_roles_values:
            
            # EL ERROR DEBE ESTAR AQUÍ: Asegúrese que la línea termina con un paréntesis de cierre
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, # 403: Prohibido
                detail=f"Permiso denegado. Rol '{user_role_value}' no autorizado para esta acción."
            )
        
        return current_user
        
    return role_verifier