erDiagram
    %% ===== MAESTROS / USUARIOS =====
    PERFIL ||--o{ USUARIO : pel_id
    APLICACION ||--o{ PERFIL_APLICACION : apl_id
    PERFIL ||--o{ PERFIL_APLICACION : pel_id

    %% ===== GEOGRAFIA =====
    REGION ||--o{ PROVINCIA : reg_id
    PROVINCIA ||--o{ COMUNA : pro_id
    ZONA ||--o{ DISTRITO : zon_id
    DISTRITO ||--o{ GRUPO : dis_id

    %% ===== PERSONAS =====
    ESTADO_CIVIL ||--o{ PERSONA : esc_id
    COMUNA ||--o{ PERSONA : com_id
    USUARIO ||--o{ PERSONA : usu_id

    PERSONA ||--o{ PERSONA_GRUPO : per_id
    GRUPO ||--o{ PERSONA_GRUPO : gru_id

    PERSONA ||--o{ PERSONA_NIVEL : per_id
    NIVEL ||--o{ PERSONA_NIVEL : niv_id
    RAMA ||--o{ PERSONA_NIVEL : ram_id

    PERSONA ||--o{ PERSONA_FORMADOR : per_id

    PERSONA ||--o{ PERSONA_INDIVIDUAL : per_id
    CARGO ||--o{ PERSONA_INDIVIDUAL : car_id
    DISTRITO ||--o{ PERSONA_INDIVIDUAL : dis_id
    ZONA ||--o{ PERSONA_INDIVIDUAL : zon_id

    %% ===== CURSOS =====
    USUARIO ||--o{ CURSO : usu_id
    TIPO_CURSO ||--o{ CURSO : tcu_id
    PERSONA ||--o{ CURSO : per_id_responsable
    CARGO ||--o{ CURSO : car_id_responsable
    COMUNA ||--o{ CURSO : com_id_lugar

    CURSO ||--o{ CURSO_SECCION : cur_id
    RAMA ||--o{ CURSO_SECCION : ram_id

    CURSO ||--o{ CURSO_FECHA : cur_id
    CURSO ||--o{ CURSO_CUOTA : cur_id

    CURSO ||--o{ CURSO_ALIMENTACION : cur_id
    ALIMENTACION ||--o{ CURSO_ALIMENTACION : ali_id

    CURSO ||--o{ CURSO_COORDINADOR : cur_id
    PERSONA ||--o{ CURSO_COORDINADOR : per_id
    CARGO ||--o{ CURSO_COORDINADOR : car_id

    CURSO ||--o{ CURSO_FORMADOR : cur_id
    PERSONA ||--o{ CURSO_FORMADOR : per_id
    ROL ||--o{ CURSO_FORMADOR : rol_id
    CURSO_SECCION ||--o{ CURSO_FORMADOR : cus_id

    %% ===== INSCRIPCION EN CURSO =====
    PERSONA ||--o{ PERSONA_CURSO : per_id
    CURSO_SECCION ||--o{ PERSONA_CURSO : cus_id
    ROL ||--o{ PERSONA_CURSO : rol_id
    ALIMENTACION ||--o{ PERSONA_CURSO : ali_id
    NIVEL ||--o{ PERSONA_CURSO : niv_id

    PERSONA_CURSO ||--o{ PERSONA_VEHICULO : pec_id
    PERSONA_CURSO ||--o{ PERSONA_ESTADO_CURSO : pec_id
    USUARIO ||--o{ PERSONA_ESTADO_CURSO : usu_id

    %% ===== PREINSCRIPCION =====
    PERSONA ||--o{ PREINSCRIPCION : persona_id
    CURSO ||--o{ PREINSCRIPCION : curso_id
    RAMA ||--o{ PREINSCRIPCION : rama_id
    GRUPO ||--o{ PREINSCRIPCION : grupo_asignado_id
    USUARIO ||--o{ PREINSCRIPCION : habilitado_por_id
    PAGO_PERSONA ||--o{ PREINSCRIPCION : confirmado_por_pago_id

    PREINSCRIPCION ||--o{ PREINSCRIPCION_ESTADO_LOG : preinscripcion_id
    USUARIO ||--o{ PREINSCRIPCION_ESTADO_LOG : cambiado_por_id

    CURSO ||--o{ CUPO_CONFIGURACION : curso_id
    ROL ||--o{ CUPO_CONFIGURACION : rol_id
    RAMA ||--o{ CUPO_CONFIGURACION : rama_id

    PERSONA ||--o{ DOCUMENTO : persona_id
    ARCHIVO ||--o{ DOCUMENTO : archivo_id

    %% ===== PAGOS =====
    PERSONA ||--o{ PAGO_PERSONA : per_id
    CURSO ||--o{ PAGO_PERSONA : cur_id
    USUARIO ||--o{ PAGO_PERSONA : usu_id

    USUARIO ||--o{ COMPROBANTE_PAGO : usu_id
    PERSONA_CURSO ||--o{ COMPROBANTE_PAGO : pec_id
    CONCEPTO_CONTABLE ||--o{ COMPROBANTE_PAGO : coc_id

    PAGO_PERSONA ||--o{ PAGO_COMPROBANTE : pap_id
    COMPROBANTE_PAGO ||--o{ PAGO_COMPROBANTE : cpa_id

    PERSONA ||--o{ PAGO_CAMBIO_PERSONA : per_id
    PAGO_PERSONA ||--o{ PAGO_CAMBIO_PERSONA : pap_id
    USUARIO ||--o{ PAGO_CAMBIO_PERSONA : usu_id

    PERSONA ||--o{ PREPAGO : per_id
    CURSO ||--o{ PREPAGO : cur_id
    PAGO_PERSONA ||--o{ PREPAGO : pap_id

    PROVEEDOR ||--o{ PAGO_PROVEEDOR : prv_id
    USUARIO ||--o{ PAGO_PROVEEDOR : usu_id
    CONCEPTO_CONTABLE ||--o{ PAGO_PROVEEDOR : coc_id

    %% ===== ARCHIVOS =====
    TIPO_ARCHIVO ||--o{ ARCHIVO : tar_id
    USUARIO ||--o{ ARCHIVO : usu_id_crea
    USUARIO ||--o{ ARCHIVO : usu_id_modifica

    ARCHIVO ||--o{ ARCHIVO_CURSO : arc_id
    CURSO_SECCION ||--o{ ARCHIVO_CURSO : cus_id

    ARCHIVO ||--o{ ARCHIVO_PERSONA : arc_id
    PERSONA ||--o{ ARCHIVO_PERSONA : per_id
    CURSO_SECCION ||--o{ ARCHIVO_PERSONA : cus_id

    %% ===== EMAILS =====
    USUARIO ||--o{ EMAIL_TEMPLATE : created_by
    EMAIL_TEMPLATE ||--o{ EMAIL_LOG : template
    USUARIO ||--o{ EMAIL_LOG : recipient_user

    EMAIL_TEMPLATE ||--o{ EMAIL_QUEUE : template
    USUARIO ||--o{ EMAIL_QUEUE : recipient_user

    EMAIL_QUEUE ||--o{ EMAIL_ATTACHMENT : email_queue
    EMAIL_LOG ||--o{ EMAIL_ATTACHMENT : email_log