/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     29/10/2025 14:30:06                          */
/*==============================================================*/


alter table archivo 
   drop foreign key fk_archivo_rel_033_usuario;

alter table archivo 
   drop foreign key fk_archivo_rel_035_usuario;

alter table archivo 
   drop foreign key fk_archivo_rel_036_tipo_arc;

alter table archivo_curso 
   drop foreign key fk_archivo__rel_032_archivo;

alter table archivo_curso 
   drop foreign key fk_archivo__rel_034_curso_se;

alter table archivo_persona 
   drop foreign key fk_archivo__rel_037_archivo;

alter table archivo_persona 
   drop foreign key fk_archivo__rel_038_persona;

alter table archivo_persona 
   drop foreign key fk_archivo__rel_039_curso_se;

alter table comprobante_pago 
   drop foreign key fk_comproba_rel_061_usuario;

alter table comprobante_pago 
   drop foreign key fk_comproba_rel_062_concepto;

alter table comprobante_pago 
   drop foreign key fk_comproba_rel_063_persona_;

alter table comuna 
   drop foreign key fk_comuna_rel_002_provinci;

alter table curso 
   drop foreign key fk_curso_rel_017_tipo_cur;

alter table curso 
   drop foreign key fk_curso_rel_018_usuario;

alter table curso 
   drop foreign key fk_curso_rel_019_persona;

alter table curso 
   drop foreign key fk_curso_rel_024_comuna;

alter table curso 
   drop foreign key fk_curso_rel_052_cargo;

alter table curso_alimentacion 
   drop foreign key fk_curso_al_rel_064_alimenta;

alter table curso_alimentacion 
   drop foreign key fk_curso_al_rel_065_curso;

alter table curso_coordinador 
   drop foreign key fk_curso_co_rel_020_curso;

alter table curso_coordinador 
   drop foreign key fk_curso_co_rel_021_cargo;

alter table curso_coordinador 
   drop foreign key fk_curso_co_rel_022_persona;

alter table curso_cuota 
   drop foreign key fk_curso_cu_rel_023_curso;

alter table curso_fecha 
   drop foreign key fk_curso_fe_rel_025_curso;

alter table curso_formador 
   drop foreign key fk_curso_fo_rel_028_curso;

alter table curso_formador 
   drop foreign key fk_curso_fo_rel_029_persona;

alter table curso_formador 
   drop foreign key fk_curso_fo_rel_030_rol;

alter table curso_formador 
   drop foreign key fk_curso_fo_rel_031_curso_se;

alter table curso_seccion 
   drop foreign key fk_curso_se_rel_026_curso;

alter table curso_seccion 
   drop foreign key fk_curso_se_rel_027_rama;

alter table distrito 
   drop foreign key fk_distrito_rel_003_zona;

alter table grupo 
   drop foreign key fk_grupo_rel_004_distrito;

alter table pago_cambio_persona 
   drop foreign key fk_pago_cam_rel_043_persona;

alter table pago_cambio_persona 
   drop foreign key fk_pago_cam_rel_044_pago_per;

alter table pago_cambio_persona 
   drop foreign key fk_pago_cam_rel_046_usuario;

alter table pago_comprobante 
   drop foreign key fk_pago_com_rel_059_pago_per;

alter table pago_comprobante 
   drop foreign key fk_pago_com_rel_060_comproba;

alter table pago_persona 
   drop foreign key fk_pago_per_rel_041_persona;

alter table pago_persona 
   drop foreign key fk_pago_per_rel_042_curso;

alter table pago_persona 
   drop foreign key fk_pago_per_rel_045_usuario;

alter table perfil_aplicacion 
   drop foreign key fk_perfil_a_rel_067_perfil;

alter table perfil_aplicacion 
   drop foreign key fk_perfil_a_rel_068_aplicaci;

alter table persona 
   drop foreign key fk_persona_rel_006_estado_c;

alter table persona 
   drop foreign key fk_persona_rel_007_comuna;

alter table persona 
   drop foreign key fk_persona_rel_047_usuario;

alter table persona_curso 
   drop foreign key fk_persona__rel_008_persona;

alter table persona_curso 
   drop foreign key fk_persona__rel_009_rol;

alter table persona_curso 
   drop foreign key fk_persona__rel_011_alimenta;

alter table persona_curso 
   drop foreign key fk_persona__rel_012_nivel;

alter table persona_curso 
   drop foreign key fk_persona__rel_040_curso_se;

alter table persona_estado_curso 
   drop foreign key fk_persona__rel_053_persona_;

alter table persona_estado_curso 
   drop foreign key fk_persona__rel_054_usuario;

alter table persona_formador 
   drop foreign key fk_persona__rel_016_persona;

alter table persona_grupo 
   drop foreign key fk_persona__rel_005_grupo;

alter table persona_grupo 
   drop foreign key fk_persona__rel_010_persona;

alter table persona_individual 
   drop foreign key fk_persona__rel_048_persona;

alter table persona_individual 
   drop foreign key fk_persona__rel_049_cargo;

alter table persona_individual 
   drop foreign key fk_persona__rel_050_distrito;

alter table persona_individual 
   drop foreign key fk_persona__rel_051_zona;

alter table persona_nivel 
   drop foreign key fk_persona__rel_013_persona;

alter table persona_nivel 
   drop foreign key fk_persona__rel_014_nivel;

alter table persona_nivel 
   drop foreign key fk_persona__rel_015_rama;

alter table persona_vehiculo 
   drop foreign key fk_persona__rel_055_persona_;

alter table prepago 
   drop foreign key fk_prepago_rel_056_persona;

alter table prepago 
   drop foreign key fk_prepago_rel_057_curso;

alter table prepago 
   drop foreign key fk_prepago_rel_058_pago_per;

alter table provincia 
   drop foreign key fk_provinci_rel_001_region;

alter table usuario 
   drop foreign key fk_usuario_rel_066_perfil;

drop table if exists alimentacion;

drop table if exists aplicacion;


alter table archivo 
   drop foreign key fk_archivo_rel_033_usuario;

alter table archivo 
   drop foreign key fk_archivo_rel_035_usuario;

alter table archivo 
   drop foreign key fk_archivo_rel_036_tipo_arc;

drop table if exists archivo;


alter table archivo_curso 
   drop foreign key fk_archivo__rel_032_archivo;

alter table archivo_curso 
   drop foreign key fk_archivo__rel_034_curso_se;

drop table if exists archivo_curso;


alter table archivo_persona 
   drop foreign key fk_archivo__rel_037_archivo;

alter table archivo_persona 
   drop foreign key fk_archivo__rel_038_persona;

alter table archivo_persona 
   drop foreign key fk_archivo__rel_039_curso_se;

drop table if exists archivo_persona;

drop table if exists cargo;


alter table comprobante_pago 
   drop foreign key fk_comproba_rel_061_usuario;

alter table comprobante_pago 
   drop foreign key fk_comproba_rel_063_persona_;

alter table comprobante_pago 
   drop foreign key fk_comproba_rel_062_concepto;

drop table if exists comprobante_pago;


alter table comuna 
   drop foreign key fk_comuna_rel_002_provinci;

drop table if exists comuna;

drop table if exists concepto_contable;


alter table curso 
   drop foreign key fk_curso_rel_017_tipo_cur;

alter table curso 
   drop foreign key fk_curso_rel_018_usuario;

alter table curso 
   drop foreign key fk_curso_rel_019_persona;

alter table curso 
   drop foreign key fk_curso_rel_024_comuna;

alter table curso 
   drop foreign key fk_curso_rel_052_cargo;

drop table if exists curso;


alter table curso_alimentacion 
   drop foreign key fk_curso_al_rel_064_alimenta;

alter table curso_alimentacion 
   drop foreign key fk_curso_al_rel_065_curso;

drop table if exists curso_alimentacion;


alter table curso_coordinador 
   drop foreign key fk_curso_co_rel_020_curso;

alter table curso_coordinador 
   drop foreign key fk_curso_co_rel_021_cargo;

alter table curso_coordinador 
   drop foreign key fk_curso_co_rel_022_persona;

drop table if exists curso_coordinador;


alter table curso_cuota 
   drop foreign key fk_curso_cu_rel_023_curso;

drop table if exists curso_cuota;


alter table curso_fecha 
   drop foreign key fk_curso_fe_rel_025_curso;

drop table if exists curso_fecha;


alter table curso_formador 
   drop foreign key fk_curso_fo_rel_028_curso;

alter table curso_formador 
   drop foreign key fk_curso_fo_rel_029_persona;

alter table curso_formador 
   drop foreign key fk_curso_fo_rel_030_rol;

alter table curso_formador 
   drop foreign key fk_curso_fo_rel_031_curso_se;

drop table if exists curso_formador;


alter table curso_seccion 
   drop foreign key fk_curso_se_rel_026_curso;

alter table curso_seccion 
   drop foreign key fk_curso_se_rel_027_rama;

drop table if exists curso_seccion;


alter table distrito 
   drop foreign key fk_distrito_rel_003_zona;

drop table if exists distrito;

drop table if exists estado_civil;


alter table grupo 
   drop foreign key fk_grupo_rel_004_distrito;

drop table if exists grupo;

drop table if exists nivel;


alter table pago_cambio_persona 
   drop foreign key fk_pago_cam_rel_043_persona;

alter table pago_cambio_persona 
   drop foreign key fk_pago_cam_rel_044_pago_per;

alter table pago_cambio_persona 
   drop foreign key fk_pago_cam_rel_046_usuario;

drop table if exists pago_cambio_persona;


alter table pago_comprobante 
   drop foreign key fk_pago_com_rel_059_pago_per;

alter table pago_comprobante 
   drop foreign key fk_pago_com_rel_060_comproba;

drop table if exists pago_comprobante;


alter table pago_persona 
   drop foreign key fk_pago_per_rel_041_persona;

alter table pago_persona 
   drop foreign key fk_pago_per_rel_042_curso;

alter table pago_persona 
   drop foreign key fk_pago_per_rel_045_usuario;

drop table if exists pago_persona;

drop table if exists perfil;


alter table perfil_aplicacion 
   drop foreign key fk_perfil_a_rel_067_perfil;

alter table perfil_aplicacion 
   drop foreign key fk_perfil_a_rel_068_aplicaci;

drop table if exists perfil_aplicacion;


alter table persona 
   drop foreign key fk_persona_rel_006_estado_c;

alter table persona 
   drop foreign key fk_persona_rel_007_comuna;

alter table persona 
   drop foreign key fk_persona_rel_047_usuario;

drop table if exists persona;


alter table persona_curso 
   drop foreign key fk_persona__rel_008_persona;

alter table persona_curso 
   drop foreign key fk_persona__rel_009_rol;

alter table persona_curso 
   drop foreign key fk_persona__rel_011_alimenta;

alter table persona_curso 
   drop foreign key fk_persona__rel_012_nivel;

alter table persona_curso 
   drop foreign key fk_persona__rel_040_curso_se;

drop table if exists persona_curso;


alter table persona_estado_curso 
   drop foreign key fk_persona__rel_053_persona_;

alter table persona_estado_curso 
   drop foreign key fk_persona__rel_054_usuario;

drop table if exists persona_estado_curso;


alter table persona_formador 
   drop foreign key fk_persona__rel_016_persona;

drop table if exists persona_formador;


alter table persona_grupo 
   drop foreign key fk_persona__rel_005_grupo;

alter table persona_grupo 
   drop foreign key fk_persona__rel_010_persona;

drop table if exists persona_grupo;


alter table persona_individual 
   drop foreign key fk_persona__rel_048_persona;

alter table persona_individual 
   drop foreign key fk_persona__rel_049_cargo;

alter table persona_individual 
   drop foreign key fk_persona__rel_050_distrito;

alter table persona_individual 
   drop foreign key fk_persona__rel_051_zona;

drop table if exists persona_individual;


alter table persona_nivel 
   drop foreign key fk_persona__rel_013_persona;

alter table persona_nivel 
   drop foreign key fk_persona__rel_014_nivel;

alter table persona_nivel 
   drop foreign key fk_persona__rel_015_rama;

drop table if exists persona_nivel;


alter table persona_vehiculo 
   drop foreign key fk_persona__rel_055_persona_;

drop table if exists persona_vehiculo;


alter table prepago 
   drop foreign key fk_prepago_rel_056_persona;

alter table prepago 
   drop foreign key fk_prepago_rel_057_curso;

alter table prepago 
   drop foreign key fk_prepago_rel_058_pago_per;

drop table if exists prepago;

drop table if exists proveedor;


alter table provincia 
   drop foreign key fk_provinci_rel_001_region;

drop table if exists provincia;

drop table if exists rama;

drop table if exists region;

drop table if exists rol;

drop table if exists tipo_archivo;

drop table if exists tipo_curso;


alter table usuario 
   drop foreign key fk_usuario_rel_066_perfil;

drop table if exists usuario;

drop table if exists zona;

/*==============================================================*/
/* Table: alimentacion                                          */
/*==============================================================*/
create table alimentacion
(
   ali_id               numeric(10) not null  comment '',
   ali_descripcion      varchar(100) not null  comment '',
   ali_tipo             int not null  comment '1: Con Almuerzo
             2: Sin Almuerzo
             
             Se realaciona con CUU_TIPO (Curso Cuota)',
   ali_vigente          bit not null  comment '',
   primary key (ali_id)
);

alter table alimentacion comment 'ALI

Tabla que registra los tipos de alimentació';

/*==============================================================*/
/* Table: aplicacion                                            */
/*==============================================================*/
create table aplicacion
(
   apl_id               numeric(10) not null  comment '',
   apl_descripcion      varchar(50) not null  comment '',
   apl_vigente          bit not null  comment '',
   primary key (apl_id)
);

alter table aplicacion comment 'APL

Tabla que registra todos los módulos del si';

/*==============================================================*/
/* Table: archivo                                               */
/*==============================================================*/
create table archivo
(
   arc_id               numeric(10) not null  comment '',
   tar_id               numeric(10) not null  comment '',
   usu_id_crea          numeric(10) not null  comment '',
   usu_id_modifica      numeric(10)  comment '',
   arc_fecha_hora       datetime not null  comment '',
   arc_descripcion      varchar(100) not null  comment '',
   arc_ruta             text not null  comment '',
   arc_vigente          bit not null  comment '',
   primary key (arc_id)
);

alter table archivo comment 'ARC

Tabla que registra los Archivos adjuntos en';

/*==============================================================*/
/* Table: archivo_curso                                         */
/*==============================================================*/
create table archivo_curso
(
   aru_id               numeric(10) not null  comment '',
   arc_id               numeric(10) not null  comment '',
   cus_id               numeric(10) not null  comment '',
   primary key (aru_id)
);

alter table archivo_curso comment 'ARU

Tabla que registra los Archivos del Curso (';

/*==============================================================*/
/* Table: archivo_persona                                       */
/*==============================================================*/
create table archivo_persona
(
   arp_id               numeric(10) not null  comment '',
   arc_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   cus_id               numeric(10) not null  comment '',
   primary key (arp_id)
);

alter table archivo_persona comment 'ARP

Tabla que registra los archivos de cada Per';

/*==============================================================*/
/* Table: cargo                                                 */
/*==============================================================*/
create table cargo
(
   car_id               numeric(10) not null  comment '',
   car_descripcion      varchar(100) not null  comment '',
   car_vigente          bit not null  comment '',
   primary key (car_id)
);

alter table cargo comment 'CAR

Tabla que registra los Cargos';

/*==============================================================*/
/* Table: comprobante_pago                                      */
/*==============================================================*/
create table comprobante_pago
(
   cpa_id               numeric(10) not null  comment '',
   usu_id               numeric(10) not null  comment '',
   pec_id               numeric(10) not null  comment '',
   coc_id               numeric(10) not null  comment '',
   cpa_fecha_hora       datetime not null  comment '',
   cpa_fecha            date not null  comment '',
   cpa_numero           int not null  comment '',
   cpa_valor            numeric(21,6) not null  comment '',
   primary key (cpa_id)
);

alter table comprobante_pago comment 'CPA


Se ingresan los Comprobantes de Ingr';

/*==============================================================*/
/* Table: comuna                                                */
/*==============================================================*/
create table comuna
(
   com_id               numeric(10) not null  comment '',
   pro_id               numeric(10) not null  comment '',
   com_descripcion      varchar(100) not null  comment '',
   com_vigente          bit not null  comment '',
   primary key (com_id)
);

alter table comuna comment 'COM

Tabla que registra las Comunas';

/*==============================================================*/
/* Table: concepto_contable                                     */
/*==============================================================*/
create table concepto_contable
(
   coc_id               numeric(10) not null  comment '',
   coc_descripcion      varchar(50) not null  comment '',
   coc_vigente          bit not null  comment '',
   primary key (coc_id)
);

alter table concepto_contable comment 'COC


Tabla que registra los conceptos par';

/*==============================================================*/
/* Table: curso                                                 */
/*==============================================================*/
create table curso
(
   cur_id               numeric(10) not null  comment '',
   usu_id               numeric(10) not null  comment '',
   tcu_id               numeric(10) not null  comment '',
   per_id_responsable   numeric(10) not null  comment '',
   car_id_responsable   numeric(10) not null  comment '',
   com_id_lugar         numeric(10)  comment '',
   cur_fecha_hora       datetime not null  comment '',
   cur_fecha_solicitud  datetime not null  comment '',
   cur_codigo           varchar(10) not null  comment '',
   cur_descripcion      varchar(50)  comment '',
   cur_observacion      varchar(255)  comment '',
   cur_administra       int not null  comment '1: Zona
             2: Distrito',
   cur_cuota_con_almuerzo numeric(21,6) not null  comment '',
   cur_cuota_sin_almuerzo numeric(21,6) not null  comment '',
   cur_modalidad        int not null  comment '1: Internado
             2: Externado
             3: Internado/Externado',
   cur_tipo_curso       int not null  comment '1: Presencial
             2: Online
             3: Híbrido
             ',
   cur_lugar            varchar(100)  comment '',
   cur_estado           int not null  comment '0: Pendiente
             1: Vigente
             2: Anulado
             3: Finalizado',
   primary key (cur_id)
);

alter table curso comment 'CUR

Tabla que registra los cursos que se hacen ';

/*==============================================================*/
/* Table: curso_alimentacion                                    */
/*==============================================================*/
create table curso_alimentacion
(
   cua_id               numeric(10) not null  comment '',
   cur_id               numeric(10) not null  comment '',
   ali_id               numeric(10) not null  comment '',
   cua_fecha            datetime not null  comment '',
   cua_tiempo           int not null  comment '1: Desayuno
             2: Almuerzo
             3: Once
             4: Cena
             5: Once/Cena',
   cua_descripcion      varchar(100) not null  comment '',
   cua_cantidad_adicional int not null  comment '',
   cua_vigente          bit not null  comment '',
   primary key (cua_id)
);

alter table curso_alimentacion comment 'CUA

Tabla que registra la aliimentación que hab';

/*==============================================================*/
/* Table: curso_coordinador                                     */
/*==============================================================*/
create table curso_coordinador
(
   cuc_id               numeric(10) not null  comment '',
   cur_id               numeric(10) not null  comment '',
   car_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   cuc_cargo            varchar(100)  comment '',
   primary key (cuc_id)
);

alter table curso_coordinador comment 'CUC

Tabla que registra los Coordinadores o Resp';

/*==============================================================*/
/* Table: curso_cuota                                           */
/*==============================================================*/
create table curso_cuota
(
   cuu_id               numeric(10) not null  comment '',
   cur_id               numeric(10) not null  comment '',
   cuu_tipo             int not null  comment '1: Con Almuerzo
             2: Sin Almuerzo
             
             Se realaciona con ALI_TIPO (Alimentación)',
   cuu_fecha            datetime not null  comment '',
   cuu_valor            numeric(21,6) not null  comment '',
   primary key (cuu_id)
);

alter table curso_cuota comment 'CUU

Tabla que registra las cuotas del Curso';

/*==============================================================*/
/* Table: curso_fecha                                           */
/*==============================================================*/
create table curso_fecha
(
   cuf_id               numeric(10) not null  comment '',
   cur_id               numeric(10) not null  comment '',
   cuf_fecha_inicio     datetime not null  comment '',
   cuf_fecha_termino    datetime not null  comment '',
   cuf_tipo             int not null  comment '1: Presencial
             2: Online
             3: Hbrido',
   primary key (cuf_id)
);

alter table curso_fecha comment 'CUF

Tabla que registra las Fchas y modalidades ';

/*==============================================================*/
/* Table: curso_formador                                        */
/*==============================================================*/
create table curso_formador
(
   cuo_id               numeric(10) not null  comment '',
   cur_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   rol_id               numeric(10) not null  comment '',
   cus_id               numeric(10) not null  comment '',
   cuo_director         bit not null  comment '',
   primary key (cuo_id)
);

alter table curso_formador comment 'CUO

Tabla que registra los Formadores del Curso';

/*==============================================================*/
/* Table: curso_seccion                                         */
/*==============================================================*/
create table curso_seccion
(
   cus_id               numeric(10) not null  comment '',
   cur_id               numeric(10) not null  comment '',
   ram_id               numeric(10)  comment '',
   cus_seccion          int not null  comment '',
   cus_cant_participante int not null  comment '',
   primary key (cus_id)
);

alter table curso_seccion comment 'CUS

Tabla que registra las secciones y/o Ramas ';

/*==============================================================*/
/* Table: distrito                                              */
/*==============================================================*/
create table distrito
(
   dis_id               numeric(10) not null  comment '',
   zon_id               numeric(10) not null  comment '',
   dis_descripcion      varchar(100) not null  comment '',
   dis_vigente          bit not null  comment '',
   primary key (dis_id)
);

alter table distrito comment 'DIS

Tabla que registra los Distritos';

/*==============================================================*/
/* Table: estado_civil                                          */
/*==============================================================*/
create table estado_civil
(
   esc_id               numeric(10) not null  comment '',
   esc_descripcion      varchar(50) not null  comment '',
   esc_vigente          bit not null  comment '',
   primary key (esc_id)
);

alter table estado_civil comment 'ESC

Tabla que registra el Estado Civil';

/*==============================================================*/
/* Table: grupo                                                 */
/*==============================================================*/
create table grupo
(
   gru_id               numeric(10) not null  comment '',
   dis_id               numeric(10) not null  comment '',
   gru_descripcion      varchar(100) not null  comment '',
   gru_vigente          bit not null  comment '',
   primary key (gru_id)
);

alter table grupo comment 'GRU

Tabla que registra los Grupos de cada Distr';

/*==============================================================*/
/* Table: nivel                                                 */
/*==============================================================*/
create table nivel
(
   niv_id               numeric(10) not null  comment '',
   niv_descripcion      varchar(50) not null  comment '',
   niv_orden            int not null  comment '',
   niv_vigente          bit not null  comment '',
   primary key (niv_id)
);

alter table nivel comment 'NIV

Tabla que registra los Niveles';

/*==============================================================*/
/* Table: pago_cambio_persona                                   */
/*==============================================================*/
create table pago_cambio_persona
(
   pcp_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   pap_id               numeric(10) not null  comment '',
   usu_id               numeric(10) not null  comment '',
   pcp_fecha_hora       datetime not null  comment '',
   primary key (pcp_id)
);

alter table pago_cambio_persona comment 'PCP

Tabla que registra si un pago anterior se c';

/*==============================================================*/
/* Table: pago_comprobante                                      */
/*==============================================================*/
create table pago_comprobante
(
   pco_id               numeric(10) not null  comment '',
   pap_id               numeric(10) not null  comment '',
   cpa_id               numeric(10) not null  comment '',
   primary key (pco_id)
);

alter table pago_comprobante comment 'PCO

Tabla que une todos los pagos a un comproba';

/*==============================================================*/
/* Table: pago_persona                                          */
/*==============================================================*/
create table pago_persona
(
   pap_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   cur_id               numeric(10) not null  comment '',
   usu_id               numeric(10) not null  comment '',
   pap_fecha_hora       datetime not null  comment '',
   pap_tipo             int not null  comment '1: Ingreso
             2: Egreso',
   pap_valor            numeric(21,6) not null  comment '',
   pap_observacion      varchar(100)  comment '',
   primary key (pap_id)
);

alter table pago_persona comment 'PAP

Tabla que registra los Pagos de cada Person';

/*==============================================================*/
/* Table: perfil                                                */
/*==============================================================*/
create table perfil
(
   pel_id               numeric(10) not null  comment '',
   pel_descripcion      varchar(50) not null  comment '',
   pel_vigente          bit not null  comment '',
   primary key (pel_id)
);

alter table perfil comment 'PEL

Tabla que registra todos los roles del sist';

/*==============================================================*/
/* Table: perfil_aplicacion                                     */
/*==============================================================*/
create table perfil_aplicacion
(
   pea_id               numeric(10) not null  comment '',
   pel_id               numeric(10) not null  comment '',
   apl_id               numeric(10) not null  comment '',
   pea_ingresar         bit not null  comment '',
   pea_modificar        bit not null  comment '',
   pea_eliminar         bit not null  comment '',
   pea_consultar        bit not null  comment '',
   primary key (pea_id)
);

alter table perfil_aplicacion comment 'PEA

Tabla que registra las aplicaciones o modul';

/*==============================================================*/
/* Table: persona                                               */
/*==============================================================*/
create table persona
(
   per_id               numeric(10) not null  comment '',
   esc_id               numeric(10) not null  comment '',
   com_id               numeric(10) not null  comment '',
   usu_id               numeric(10) not null  comment '',
   per_fecha_hora       datetime not null  comment '',
   per_run              numeric(9) not null  comment '',
   per_dv               varchar(1) not null  comment '',
   per_apelpat          varchar(50) not null  comment '',
   per_apelmat          varchar(50)  comment '',
   per_nombres          varchar(50) not null  comment '',
   per_email            varchar(100) not null  comment '',
   per_fecha_nac        datetime not null  comment '',
   per_direccion        varchar(255) not null  comment '',
   per_tipo_fono        int not null  comment '1: Fono Fijo
             2: Celular
             3: Celular/WhatsApp
             4: WhatsApp',
   per_fono             varchar(15) not null  comment '',
   per_alergia_enfermedad varchar(255)  comment '',
   per_limitacion       varchar(255)  comment '',
   per_nom_emergencia   varchar(50)  comment '',
   per_fono_emergencia  varchar(15)  comment '',
   per_otros            varchar(255)  comment '',
   per_num_mmaa         int  comment '',
   per_profesion        varchar(100)  comment '',
   per_tiempo_nnaj      varchar(50)  comment '',
   per_tiempo_adulto    varchar(50)  comment '',
   per_religion         varchar(50)  comment '',
   per_apodo            varchar(50) not null  comment '',
   per_foto             text  comment '',
   per_vigente          bit not null  comment '',
   primary key (per_id)
);

alter table persona comment 'PER

Tabla que registra las Personas que partici';

/*==============================================================*/
/* Table: persona_curso                                         */
/*==============================================================*/
create table persona_curso
(
   pec_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   cus_id               numeric(10) not null  comment '',
   rol_id               numeric(10) not null  comment '',
   ali_id               numeric(10) not null  comment '',
   niv_id               numeric(10)  comment '',
   pec_observacion      text  comment '',
   pec_registro         bit not null  comment '',
   pec_acreditado       bit not null  comment '',
   primary key (pec_id)
);

alter table persona_curso comment 'PEC

Tabla que registra los datos de las Persona';

/*==============================================================*/
/* Table: persona_estado_curso                                  */
/*==============================================================*/
create table persona_estado_curso
(
   peu_id               numeric(10) not null  comment '',
   usu_id               numeric(10) not null  comment '',
   pec_id               numeric(10) not null  comment '',
   peu_fecha_hora       datetime not null  comment '',
   peu_estado           int not null  comment '1: Pre Inscripción
             2: Avisado
             3: Lista de Espera
             4: Inscrito
             5: Vigente
             6: Anulado
             10: Sobrecupo',
   peu_vigente          bit not null  comment '',
   primary key (peu_id)
);

alter table persona_estado_curso comment 'PEU


Tabla que registra los diferentes es';

/*==============================================================*/
/* Table: persona_formador                                      */
/*==============================================================*/
create table persona_formador
(
   pef_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   pef_hab_1            bit not null  comment '',
   pef_hab_2            bit not null  comment '',
   pef_verif            bit not null  comment '',
   pef_historial        text  comment 'Historial de capacitaciones que tiene la Persona.
             Esto es para todos los cursos que no es´tan registrado en esta plataforma',
   primary key (pef_id)
);

alter table persona_formador comment 'PEF

Tabla que registra si una persona es o no F';

/*==============================================================*/
/* Table: persona_grupo                                         */
/*==============================================================*/
create table persona_grupo
(
   peg_id               numeric(10) not null  comment '',
   gru_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   peg_vigente          bit not null  comment '',
   primary key (peg_id)
);

alter table persona_grupo comment 'PEG

Tabla que registra los Grupos que ha estado';

/*==============================================================*/
/* Table: persona_individual                                    */
/*==============================================================*/
create table persona_individual
(
   pei_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   car_id               numeric(10) not null  comment '',
   dis_id               numeric(10)  comment '',
   zon_id               numeric(10)  comment '',
   pei_vigente          bit not null  comment '',
   primary key (pei_id)
);

alter table persona_individual comment 'PEI

Tabla que registra si eres o no Individual,';

/*==============================================================*/
/* Table: persona_nivel                                         */
/*==============================================================*/
create table persona_nivel
(
   pen_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   niv_id               numeric(10) not null  comment '',
   ram_id               numeric(10) not null  comment '',
   primary key (pen_id)
);

alter table persona_nivel comment 'PEN

Tabla que registra los diferentes Niveles q';

/*==============================================================*/
/* Table: persona_vehiculo                                      */
/*==============================================================*/
create table persona_vehiculo
(
   pev_id               numeric(10) not null  comment '',
   pec_id               numeric(10) not null  comment '',
   pev_marca            varchar(50) not null  comment '',
   pev_modelo           varchar(50) not null  comment '',
   pev_patente          varchar(10) not null  comment '',
   primary key (pev_id)
);

alter table persona_vehiculo comment 'PEV

Tabla que registra los Vehiculos de cada Pe';

/*==============================================================*/
/* Table: prepago                                               */
/*==============================================================*/
create table prepago
(
   ppa_id               numeric(10) not null  comment '',
   per_id               numeric(10) not null  comment '',
   cur_id               numeric(10) not null  comment '',
   pap_id               numeric(10)  comment '',
   ppa_valor            numeric(21,6) not null  comment '',
   ppa_observacion      text  comment '',
   ppa_vigente          bit not null  comment '',
   primary key (ppa_id)
);

alter table prepago comment 'PPA

Tabla que registra los posibles pagos que h';

/*==============================================================*/
/* Table: proveedor                                             */
/*==============================================================*/
create table proveedor
(
   prv_id               numeric(10) not null  comment '',
   prv_descripcion      varchar(100) not null  comment '',
   prv_celular1         varchar(15) not null  comment '',
   prv_celular2         varchar(15)  comment '',
   prv_direccion        varchar(100) not null  comment '',
   prv_observacion      text  comment '',
   prv_vigente          bit not null  comment '',
   primary key (prv_id)
);

alter table proveedor comment 'PRV

Tabla que registra los Proveedores disponib';

/*==============================================================*/
/* Table: provincia                                             */
/*==============================================================*/
create table provincia
(
   pro_id               numeric(10) not null  comment '',
   reg_id               numeric(10) not null  comment '',
   pro_descripcion      varchar(100) not null  comment '',
   pro_vigente          bit not null  comment '',
   primary key (pro_id)
);

alter table provincia comment 'PRO

Tabla que registra las Provincias';

/*==============================================================*/
/* Table: rama                                                  */
/*==============================================================*/
create table rama
(
   ram_id               numeric(10) not null  comment '',
   ram_descripcion      varchar(50) not null  comment '',
   ram_vigente          bit not null  comment '',
   primary key (ram_id)
);

alter table rama comment 'RAM

Tabla que registra las Ramas.';

/*==============================================================*/
/* Table: region                                                */
/*==============================================================*/
create table region
(
   reg_id               numeric(10) not null  comment '',
   reg_descripcion      varchar(100) not null  comment '',
   reg_vigente          bit not null  comment '',
   primary key (reg_id)
);

alter table region comment 'REG

Tabla que registra las regiones de Chile';

/*==============================================================*/
/* Table: rol                                                   */
/*==============================================================*/
create table rol
(
   rol_id               numeric(10) not null  comment '',
   rol_descripcion      varchar(50) not null  comment '',
   rol_tipo             int not null  comment '1: Participante
             2: Formadores
             3: Apoyo Formadores
             4: Organización
             5: Servicio
             6: Salud',
   rol_vigente          bit not null  comment '',
   primary key (rol_id)
);

alter table rol comment 'ROL

Tabla que registra los diferentes ROL del C';

/*==============================================================*/
/* Table: tipo_archivo                                          */
/*==============================================================*/
create table tipo_archivo
(
   tar_id               numeric(10) not null  comment '',
   tar_descripcion      varchar(50) not null  comment '',
   tar_vigente          bit not null  comment '',
   primary key (tar_id)
);

alter table tipo_archivo comment 'TAR


Tabla que Registra los Tipos de Arch';

/*==============================================================*/
/* Table: tipo_curso                                            */
/*==============================================================*/
create table tipo_curso
(
   tcu_id               numeric(10) not null  comment '',
   tcu_descripcion      varchar(100) not null  comment '',
   tcu_tipo             int not null  comment '1: Inicial
             2: Medio
             3: Avanzado
             4: Habilitación
             5: Verificación
             6: Institucional',
   tcu_cant_participante int  comment '',
   tcu_vigente          bit not null  comment '',
   primary key (tcu_id)
);

alter table tipo_curso comment 'TCU

Tabla que registra los Cursos disponibles';

/*==============================================================*/
/* Table: usuario                                               */
/*==============================================================*/
create table usuario
(
   usu_id               numeric(10) not null  comment '',
   pel_id               numeric(10) not null  comment '',
   usu_username         varchar(100) not null  comment '',
   usu_password         varchar(50) not null  comment '',
   usu_ruta_foto        varchar(255) not null  comment '',
   usu_vigente          bit not null  comment '',
   primary key (usu_id)
);

alter table usuario comment 'USU

Tabla que registra los Usuarios';

/*==============================================================*/
/* Table: zona                                                  */
/*==============================================================*/
create table zona
(
   zon_id               numeric(10) not null  comment '',
   zon_descripcion      varchar(100) not null  comment '',
   zon_unilateral       bit not null  comment '',
   zon_vigente          bit not null  comment '',
   primary key (zon_id)
);

alter table zona comment 'ZON

Tabla que registra las Zonas';

alter table archivo add constraint fk_archivo_rel_033_usuario foreign key (usu_id_crea)
      references usuario (usu_id) on delete restrict on update restrict;

alter table archivo add constraint fk_archivo_rel_035_usuario foreign key (usu_id_modifica)
      references usuario (usu_id) on delete restrict on update restrict;

alter table archivo add constraint fk_archivo_rel_036_tipo_arc foreign key (tar_id)
      references tipo_archivo (tar_id) on delete restrict on update restrict;

alter table archivo_curso add constraint fk_archivo__rel_032_archivo foreign key (arc_id)
      references archivo (arc_id) on delete restrict on update restrict;

alter table archivo_curso add constraint fk_archivo__rel_034_curso_se foreign key (cus_id)
      references curso_seccion (cus_id) on delete restrict on update restrict;

alter table archivo_persona add constraint fk_archivo__rel_037_archivo foreign key (arc_id)
      references archivo (arc_id) on delete restrict on update restrict;

alter table archivo_persona add constraint fk_archivo__rel_038_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table archivo_persona add constraint fk_archivo__rel_039_curso_se foreign key (cus_id)
      references curso_seccion (cus_id) on delete restrict on update restrict;

alter table comprobante_pago add constraint fk_comproba_rel_061_usuario foreign key (usu_id)
      references usuario (usu_id) on delete restrict on update restrict;

alter table comprobante_pago add constraint fk_comproba_rel_062_concepto foreign key (coc_id)
      references concepto_contable (coc_id) on delete restrict on update restrict;

alter table comprobante_pago add constraint fk_comproba_rel_063_persona_ foreign key (pec_id)
      references persona_curso (pec_id) on delete restrict on update restrict;

alter table comuna add constraint fk_comuna_rel_002_provinci foreign key (pro_id)
      references provincia (pro_id) on delete restrict on update restrict;

alter table curso add constraint fk_curso_rel_017_tipo_cur foreign key (tcu_id)
      references tipo_curso (tcu_id) on delete restrict on update restrict;

alter table curso add constraint fk_curso_rel_018_usuario foreign key (usu_id)
      references usuario (usu_id) on delete restrict on update restrict;

alter table curso add constraint fk_curso_rel_019_persona foreign key (per_id_responsable)
      references persona (per_id) on delete restrict on update restrict;

alter table curso add constraint fk_curso_rel_024_comuna foreign key (com_id_lugar)
      references comuna (com_id) on delete restrict on update restrict;

alter table curso add constraint fk_curso_rel_052_cargo foreign key (car_id_responsable)
      references cargo (car_id) on delete restrict on update restrict;

alter table curso_alimentacion add constraint fk_curso_al_rel_064_alimenta foreign key (ali_id)
      references alimentacion (ali_id) on delete restrict on update restrict;

alter table curso_alimentacion add constraint fk_curso_al_rel_065_curso foreign key (cur_id)
      references curso (cur_id) on delete restrict on update restrict;

alter table curso_coordinador add constraint fk_curso_co_rel_020_curso foreign key (cur_id)
      references curso (cur_id) on delete restrict on update restrict;

alter table curso_coordinador add constraint fk_curso_co_rel_021_cargo foreign key (car_id)
      references cargo (car_id) on delete restrict on update restrict;

alter table curso_coordinador add constraint fk_curso_co_rel_022_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table curso_cuota add constraint fk_curso_cu_rel_023_curso foreign key (cur_id)
      references curso (cur_id) on delete restrict on update restrict;

alter table curso_fecha add constraint fk_curso_fe_rel_025_curso foreign key (cur_id)
      references curso (cur_id) on delete restrict on update restrict;

alter table curso_formador add constraint fk_curso_fo_rel_028_curso foreign key (cur_id)
      references curso (cur_id) on delete restrict on update restrict;

alter table curso_formador add constraint fk_curso_fo_rel_029_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table curso_formador add constraint fk_curso_fo_rel_030_rol foreign key (rol_id)
      references rol (rol_id) on delete restrict on update restrict;

alter table curso_formador add constraint fk_curso_fo_rel_031_curso_se foreign key (cus_id)
      references curso_seccion (cus_id) on delete restrict on update restrict;

alter table curso_seccion add constraint fk_curso_se_rel_026_curso foreign key (cur_id)
      references curso (cur_id) on delete restrict on update restrict;

alter table curso_seccion add constraint fk_curso_se_rel_027_rama foreign key (ram_id)
      references rama (ram_id) on delete restrict on update restrict;

alter table distrito add constraint fk_distrito_rel_003_zona foreign key (zon_id)
      references zona (zon_id) on delete restrict on update restrict;

alter table grupo add constraint fk_grupo_rel_004_distrito foreign key (dis_id)
      references distrito (dis_id) on delete restrict on update restrict;

alter table pago_cambio_persona add constraint fk_pago_cam_rel_043_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table pago_cambio_persona add constraint fk_pago_cam_rel_044_pago_per foreign key (pap_id)
      references pago_persona (pap_id) on delete restrict on update restrict;

alter table pago_cambio_persona add constraint fk_pago_cam_rel_046_usuario foreign key (usu_id)
      references usuario (usu_id) on delete restrict on update restrict;

alter table pago_comprobante add constraint fk_pago_com_rel_059_pago_per foreign key (pap_id)
      references pago_persona (pap_id) on delete restrict on update restrict;

alter table pago_comprobante add constraint fk_pago_com_rel_060_comproba foreign key (cpa_id)
      references comprobante_pago (cpa_id) on delete restrict on update restrict;

alter table pago_persona add constraint fk_pago_per_rel_041_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table pago_persona add constraint fk_pago_per_rel_042_curso foreign key (cur_id)
      references curso (cur_id) on delete restrict on update restrict;

alter table pago_persona add constraint fk_pago_per_rel_045_usuario foreign key (usu_id)
      references usuario (usu_id) on delete restrict on update restrict;

alter table perfil_aplicacion add constraint fk_perfil_a_rel_067_perfil foreign key (pel_id)
      references perfil (pel_id) on delete restrict on update restrict;

alter table perfil_aplicacion add constraint fk_perfil_a_rel_068_aplicaci foreign key (apl_id)
      references aplicacion (apl_id) on delete restrict on update restrict;

alter table persona add constraint fk_persona_rel_006_estado_c foreign key (esc_id)
      references estado_civil (esc_id) on delete restrict on update restrict;

alter table persona add constraint fk_persona_rel_007_comuna foreign key (com_id)
      references comuna (com_id) on delete restrict on update restrict;

alter table persona add constraint fk_persona_rel_047_usuario foreign key (usu_id)
      references usuario (usu_id) on delete restrict on update restrict;

alter table persona_curso add constraint fk_persona__rel_008_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table persona_curso add constraint fk_persona__rel_009_rol foreign key (rol_id)
      references rol (rol_id) on delete restrict on update restrict;

alter table persona_curso add constraint fk_persona__rel_011_alimenta foreign key (ali_id)
      references alimentacion (ali_id) on delete restrict on update restrict;

alter table persona_curso add constraint fk_persona__rel_012_nivel foreign key (niv_id)
      references nivel (niv_id) on delete restrict on update restrict;

alter table persona_curso add constraint fk_persona__rel_040_curso_se foreign key (cus_id)
      references curso_seccion (cus_id) on delete restrict on update restrict;

alter table persona_estado_curso add constraint fk_persona__rel_053_persona_ foreign key (pec_id)
      references persona_curso (pec_id) on delete restrict on update restrict;

alter table persona_estado_curso add constraint fk_persona__rel_054_usuario foreign key (usu_id)
      references usuario (usu_id) on delete restrict on update restrict;

alter table persona_formador add constraint fk_persona__rel_016_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table persona_grupo add constraint fk_persona__rel_005_grupo foreign key (gru_id)
      references grupo (gru_id) on delete restrict on update restrict;

alter table persona_grupo add constraint fk_persona__rel_010_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table persona_individual add constraint fk_persona__rel_048_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table persona_individual add constraint fk_persona__rel_049_cargo foreign key (car_id)
      references cargo (car_id) on delete restrict on update restrict;

alter table persona_individual add constraint fk_persona__rel_050_distrito foreign key (dis_id)
      references distrito (dis_id) on delete restrict on update restrict;

alter table persona_individual add constraint fk_persona__rel_051_zona foreign key (zon_id)
      references zona (zon_id) on delete restrict on update restrict;

alter table persona_nivel add constraint fk_persona__rel_013_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table persona_nivel add constraint fk_persona__rel_014_nivel foreign key (niv_id)
      references nivel (niv_id) on delete restrict on update restrict;

alter table persona_nivel add constraint fk_persona__rel_015_rama foreign key (ram_id)
      references rama (ram_id) on delete restrict on update restrict;

alter table persona_vehiculo add constraint fk_persona__rel_055_persona_ foreign key (pec_id)
      references persona_curso (pec_id) on delete restrict on update restrict;

alter table prepago add constraint fk_prepago_rel_056_persona foreign key (per_id)
      references persona (per_id) on delete restrict on update restrict;

alter table prepago add constraint fk_prepago_rel_057_curso foreign key (cur_id)
      references curso (cur_id) on delete restrict on update restrict;

alter table prepago add constraint fk_prepago_rel_058_pago_per foreign key (pap_id)
      references pago_persona (pap_id) on delete restrict on update restrict;

alter table provincia add constraint fk_provinci_rel_001_region foreign key (reg_id)
      references region (reg_id) on delete restrict on update restrict;

alter table usuario add constraint fk_usuario_rel_066_perfil foreign key (pel_id)
      references perfil (pel_id) on delete restrict on update restrict;

