# Modelo de Datos

Este documento describe las entidades, atributos y relaciones de la base de datos.

## Entidades y Atributos

### `alimentacion`
- `ali_id` (numeric(10), PK)
- `ali_descripcion` (varchar(100))
- `ali_tipo` (int)
- `ali_vigente` (bit)

### `aplicacion`
- `apl_id` (numeric(10), PK)
- `apl_descripcion` (varchar(50))
- `apl_vigente` (bit)

### `archivo`
- `arc_id` (numeric(10), PK)
- `tar_id` (numeric(10), FK)
- `usu_id_crea` (numeric(10), FK)
- `usu_id_modifica` (numeric(10), FK)
- `arc_fecha_hora` (datetime)
- `arc_descripcion` (varchar(100))
- `arc_ruta` (text)
- `arc_vigente` (bit)

### `archivo_curso`
- `aru_id` (numeric(10), PK)
- `arc_id` (numeric(10), FK)
- `cus_id` (numeric(10), FK)

### `archivo_persona`
- `arp_id` (numeric(10), PK)
- `arc_id` (numeric(10), FK)
- `per_id` (numeric(10), FK)
- `cus_id` (numeric(10), FK)

### `cargo`
- `car_id` (numeric(10), PK)
- `car_descripcion` (varchar(100))
- `car_vigente` (bit)

### `comprobante_pago`
- `cpa_id` (numeric(10), PK)
- `usu_id` (numeric(10), FK)
- `pec_id` (numeric(10), FK)
- `coc_id` (numeric(10), FK)
- `cpa_fecha_hora` (datetime)
- `cpa_fecha` (date)
- `cpa_numero` (int)
- `cpa_valor` (numeric(21,6))

### `comuna`
- `com_id` (numeric(10), PK)
- `pro_id` (numeric(10), FK)
- `com_descripcion` (varchar(100))
- `com_vigente` (bit)

### `concepto_contable`
- `coc_id` (numeric(10), PK)
- `coc_descripcion` (varchar(50))
- `coc_vigente` (bit)

### `curso`
- `cur_id` (numeric(10), PK)
- `usu_id` (numeric(10), FK)
- `tcu_id` (numeric(10), FK)
- `per_id_responsable` (numeric(10), FK)
- `car_id_responsable` (numeric(10), FK)
- `com_id_lugar` (numeric(10), FK)
- `cur_fecha_hora` (datetime)
- `cur_fecha_solicitud` (datetime)
- `cur_codigo` (varchar(10))
- `cur_descripcion` (varchar(50))
- `cur_observacion` (varchar(255))
- `cur_administra` (int)
- `cur_cuota_con_almuerzo` (numeric(21,6))
- `cur_cuota_sin_almuerzo` (numeric(21,6))
- `cur_modalidad` (int)
- `cur_tipo_curso` (int)
- `cur_lugar` (varchar(100))
- `cur_estado` (int)

### `curso_alimentacion`
- `cua_id` (numeric(10), PK)
- `cur_id` (numeric(10), FK)
- `ali_id` (numeric(10), FK)
- `cua_fecha` (datetime)
- `cua_tiempo` (int)
- `cua_descripcion` (varchar(100))
- `cua_cantidad_adicional` (int)
- `cua_vigente` (bit)

### `curso_coordinador`
- `cuc_id` (numeric(10), PK)
- `cur_id` (numeric(10), FK)
- `car_id` (numeric(10), FK)
- `per_id` (numeric(10), FK)
- `cuc_cargo` (varchar(100))

### `curso_cuota`
- `cuu_id` (numeric(10), PK)
- `cur_id` (numeric(10), FK)
- `cuu_tipo` (int)
- `cuu_fecha` (datetime)
- `cuu_valor` (numeric(21,6))

### `curso_fecha`
- `cuf_id` (numeric(10), PK)
- `cur_id` (numeric(10), FK)
- `cuf_fecha_inicio` (datetime)
- `cuf_fecha_termino` (datetime)
- `cuf_tipo` (int)

### `curso_formador`
- `cuo_id` (numeric(10), PK)
- `cur_id` (numeric(10), FK)
- `per_id` (numeric(10), FK)
- `rol_id` (numeric(10), FK)
- `cus_id` (numeric(10), FK)
- `cuo_director` (bit)

### `curso_seccion`
- `cus_id` (numeric(10), PK)
- `cur_id` (numeric(10), FK)
- `ram_id` (numeric(10), FK)
- `cus_seccion` (int)
- `cus_cant_participante` (int)

### `distrito`
- `dis_id` (numeric(10), PK)
- `zon_id` (numeric(10), FK)
- `dis_descripcion` (varchar(100))
- `dis_vigente` (bit)

### `estado_civil`
- `esc_id` (numeric(10), PK)
- `esc_descripcion` (varchar(50))
- `esc_vigente` (bit)

### `grupo`
- `gru_id` (numeric(10), PK)
- `dis_id` (numeric(10), FK)
- `gru_descripcion` (varchar(100))
- `gru_vigente` (bit)

### `nivel`
- `niv_id` (numeric(10), PK)
- `niv_descripcion` (varchar(50))
- `niv_orden` (int)
- `niv_vigente` (bit)

### `pago_cambio_persona`
- `pcp_id` (numeric(10), PK)
- `per_id` (numeric(10), FK)
- `pap_id` (numeric(10), FK)
- `usu_id` (numeric(10), FK)
- `pcp_fecha_hora` (datetime)

### `pago_comprobante`
- `pco_id` (numeric(10), PK)
- `pap_id` (numeric(10), FK)
- `cpa_id` (numeric(10), FK)

### `pago_persona`
- `pap_id` (numeric(10), PK)
- `per_id` (numeric(10), FK)
- `cur_id` (numeric(10), FK)
- `usu_id` (numeric(10), FK)
- `pap_fecha_hora` (datetime)
- `pap_tipo` (int)
- `pap_valor` (numeric(21,6))
- `pap_observacion` (varchar(100))

### `perfil`
- `pel_id` (numeric(10), PK)
- `pel_descripcion` (varchar(50))
- `pel_vigente` (bit)

### `perfil_aplicacion`
- `pea_id` (numeric(10), PK)
- `pel_id` (numeric(10), FK)
- `apl_id` (numeric(10), FK)
- `pea_ingresar` (bit)
- `pea_modificar` (bit)
- `pea_eliminar` (bit)
- `pea_consultar` (bit)

### `persona`
- `per_id` (numeric(10), PK)
- `esc_id` (numeric(10), FK)
- `com_id` (numeric(10), FK)
- `usu_id` (numeric(10), FK)
- `per_fecha_hora` (datetime)
- `per_run` (numeric(9))
- `per_dv` (varchar(1))
- `per_apelpat` (varchar(50))
- `per_apelmat` (varchar(50))
- `per_nombres` (varchar(50))
- `per_email` (varchar(100))
- `per_fecha_nac` (datetime)
- `per_direccion` (varchar(255))
- `per_tipo_fono` (int)
- `per_fono` (varchar(15))
- `per_alergia_enfermedad` (varchar(255))
- `per_limitacion` (varchar(255))
- `per_nom_emergencia` (varchar(50))
- `per_fono_emergencia` (varchar(15))
- `per_otros` (varchar(255))
- `per_num_mmaa` (int)
- `per_profesion` (varchar(100))
- `per_tiempo_nnaj` (varchar(50))
- `per_tiempo_adulto` (varchar(50))
- `per_religion` (varchar(50))
- `per_apodo` (varchar(50))
- `per_foto` (text)
- `per_vigente` (bit)

### `persona_curso`
- `pec_id` (numeric(10), PK)
- `per_id` (numeric(10), FK)
- `cus_id` (numeric(10), FK)
- `rol_id` (numeric(10), FK)
- `ali_id` (numeric(10), FK)
- `niv_id` (numeric(10), FK)
- `pec_observacion` (text)
- `pec_registro` (bit)
- `pec_acreditado` (bit)

### `persona_estado_curso`
- `peu_id` (numeric(10), PK)
- `usu_id` (numeric(10), FK)
- `pec_id` (numeric(10), FK)
- `peu_fecha_hora` (datetime)
- `peu_estado` (int)
- `peu_vigente` (bit)

### `persona_formador`
- `pef_id` (numeric(10), PK)
- `per_id` (numeric(10), FK)
- `pef_hab_1` (bit)
- `pef_hab_2` (bit)
- `pef_verif` (bit)
- `pef_historial` (text)

### `persona_grupo`
- `peg_id` (numeric(10), PK)
- `gru_id` (numeric(10), FK)
- `per_id` (numeric(10), FK)
- `peg_vigente` (bit)

### `persona_individual`
- `pei_id` (numeric(10), PK)
- `per_id` (numeric(10), FK)
- `car_id` (numeric(10), FK)
- `dis_id` (numeric(10), FK)
- `zon_id` (numeric(10), FK)
- `pei_vigente` (bit)

### `persona_nivel`
- `pen_id` (numeric(10), PK)
- `per_id` (numeric(10), FK)
- `niv_id` (numeric(10), FK)
- `ram_id` (numeric(10), FK)

### `persona_vehiculo`
- `pev_id` (numeric(10), PK)
- `pec_id` (numeric(10), FK)
- `pev_marca` (varchar(50))
- `pev_modelo` (varchar(50))
- `pev_patente` (varchar(10))

### `prepago`
- `ppa_id` (numeric(10), PK)
- `per_id` (numeric(10), FK)
- `cur_id` (numeric(10), FK)
- `pap_id` (numeric(10), FK)
- `ppa_valor` (numeric(21,6))
- `ppa_observacion` (text)
- `ppa_vigente` (bit)

### `proveedor`
- `prv_id` (numeric(10), PK)
- `prv_descripcion` (varchar(100))
- `prv_celular1` (varchar(15))
- `prv_celular2` (varchar(15))
- `prv_direccion` (varchar(100))
- `prv_observacion` (text)
- `prv_vigente` (bit)

### `provincia`
- `pro_id` (numeric(10), PK)
- `reg_id` (numeric(10), FK)
- `pro_descripcion` (varchar(100))
- `pro_vigente` (bit)

### `rama`
- `ram_id` (numeric(10), PK)
- `ram_descripcion` (varchar(50))
- `ram_vigente` (bit)

### `region`
- `reg_id` (numeric(10), PK)
- `reg_descripcion` (varchar(100))
- `reg_vigente` (bit)

### `rol`
- `rol_id` (numeric(10), PK)
- `rol_descripcion` (varchar(50))
- `rol_tipo` (int)
- `rol_vigente` (bit)

### `tipo_archivo`
- `tar_id` (numeric(10), PK)
- `tar_descripcion` (varchar(50))
- `tar_vigente` (bit)

### `tipo_curso`
- `tcu_id` (numeric(10), PK)
- `tcu_descripcion` (varchar(100))
- `tcu_tipo` (int)
- `tcu_cant_participante` (int)
- `tcu_vigente` (bit)

### `usuario`
- `usu_id` (numeric(10), PK)
- `pel_id` (numeric(10), FK)
- `usu_username` (varchar(100))
- `usu_password` (varchar(50))
- `usu_email` (varchar(100))
- `usu_ruta_foto` (varchar(255))
- `usu_vigente` (bit)

### `zona`
- `zon_id` (numeric(10), PK)
- `zon_descripcion` (varchar(100))
- `zon_unilateral` (bit)
- `zon_vigente` (bit)

## Relaciones (Foreign Keys)

- `archivo`:
    - `usu_id_crea` -> `usuario.usu_id`
    - `usu_id_modifica` -> `usuario.usu_id`
    - `tar_id` -> `tipo_archivo.tar_id`
- `archivo_curso`:
    - `arc_id` -> `archivo.arc_id`
    - `cus_id` -> `curso_seccion.cus_id`
- `archivo_persona`:
    - `arc_id` -> `archivo.arc_id`
    - `per_id` -> `persona.per_id`
    - `cus_id` -> `curso_seccion.cus_id`
- `comprobante_pago`:
    - `usu_id` -> `usuario.usu_id`
    - `coc_id` -> `concepto_contable.coc_id`
    - `pec_id` -> `persona_curso.pec_id`
- `comuna`:
    - `pro_id` -> `provincia.pro_id`
- `curso`:
    - `tcu_id` -> `tipo_curso.tcu_id`
    - `usu_id` -> `usuario.usu_id`
    - `per_id_responsable` -> `persona.per_id`
    - `car_id_responsable` -> `cargo.car_id`
    - `com_id_lugar` -> `comuna.com_id`
- `curso_alimentacion`:
    - `ali_id` -> `alimentacion.ali_id`
    - `cur_id` -> `curso.cur_id`
- `curso_coordinador`:
    - `cur_id` -> `curso.cur_id`
    - `car_id` -> `cargo.car_id`
    - `per_id` -> `persona.per_id`
- `curso_cuota`:
    - `cur_id` -> `curso.cur_id`
- `curso_fecha`:
    - `cur_id` -> `curso.cur_id`
- `curso_formador`:
    - `cur_id` -> `curso.cur_id`
    - `per_id` -> `persona.per_id`
    - `rol_id` -> `rol.rol_id`
    - `cus_id` -> `curso_seccion.cus_id`
- `curso_seccion`:
    - `cur_id` -> `curso.cur_id`
    - `ram_id` -> `rama.ram_id`
- `distrito`:
    - `zon_id` -> `zona.zon_id`
- `grupo`:
    - `dis_id` -> `distrito.dis_id`
- `pago_cambio_persona`:
    - `per_id` -> `persona.per_id`
    - `pap_id` -> `pago_persona.pap_id`
    - `usu_id` -> `usuario.usu_id`
- `pago_comprobante`:
    - `pap_id` -> `pago_persona.pap_id`
    - `cpa_id` -> `comprobante_pago.cpa_id`
- `pago_persona`:
    - `per_id` -> `persona.per_id`
    - `cur_id` -> `curso.cur_id`
    - `usu_id` -> `usuario.usu_id`
- `perfil_aplicacion`:
    - `pel_id` -> `perfil.pel_id`
    - `apl_id` -> `aplicacion.apl_id`
- `persona`:
    - `esc_id` -> `estado_civil.esc_id`
    - `com_id` -> `comuna.com_id`
    - `usu_id` -> `usuario.usu_id`
- `persona_curso`:
    - `per_id` -> `persona.per_id`
    - `cus_id` -> `curso_seccion.cus_id`
    - `rol_id` -> `rol.rol_id`
    - `ali_id` -> `alimentacion.ali_id`
    - `niv_id` -> `nivel.niv_id`
- `persona_estado_curso`:
    - `usu_id` -> `usuario.usu_id`
    - `pec_id` -> `persona_curso.pec_id`
- `persona_formador`:
    - `per_id` -> `persona.per_id`
- `persona_grupo`:
    - `gru_id` -> `grupo.gru_id`
    - `per_id` -> `persona.per_id`
- `persona_individual`:
    - `per_id` -> `persona.per_id`
    - `car_id` -> `cargo.car_id`
    - `dis_id` -> `distrito.dis_id`
    - `zon_id` -> `zona.zon_id`
- `persona_nivel`:
    - `per_id` -> `persona.per_id`
    - `niv_id` -> `nivel.niv_id`
    - `ram_id` -> `rama.ram_id`
- `persona_vehiculo`:
    - `pec_id` -> `persona_curso.pec_id`
- `prepago`:
    - `per_id` -> `persona.per_id`
    - `cur_id` -> `curso.cur_id`
    - `pap_id` -> `pago_persona.pap_id`
- `provincia`:
    - `reg_id` -> `region.reg_id`
- `usuario`:
    - `pel_id` -> `perfil.pel_id`
