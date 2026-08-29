import React from "react";
import LegalPage, {
  sectionStyle,
  h2Style,
  h3Style,
  pStyle,
  ulStyle,
  liStyle,
  strongStyle,
  boxStyle,
} from "../Legal";

const PrivacyPolicy = () => (
  <LegalPage title="Política de Tratamiento de Datos">
    <div style={sectionStyle}>
      <h2 style={h2Style}>1. Responsable del Tratamiento</h2>
      <p style={pStyle}>
        <strong style={strongStyle}>TheMonopolyClub</strong> (en adelante, "la Plataforma"),
        operada de manera descentralizada a través de contratos inteligentes (smart contracts)
        desplegados en la red Polygon, es responsable del tratamiento de los datos personales
        proporcionados por los usuarios durante el uso de la plataforma.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>2. Datos que Recopilamos</h2>
      <p style={pStyle}>
        Dado el carácter descentralizado de nuestra plataforma, la recopilación de datos personales
        es mínima y limitada a lo estrictamente necesario para la operación del servicio:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong style={strongStyle}>Dirección de Wallet:</strong> Dirección pública de la billetera
          blockchain del usuario (ej. MetaMask, Trust Wallet), necesaria para la interacción con
          los contratos inteligentes.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Datos de Transacción:</strong> Registros públicos de transacciones
          en la blockchain de Polygon, que son inherentemente públicos e inmutables.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Datos Técnicos:</strong> Dirección IP, tipo de navegador,
          sistema operativo, y cookies técnicas necesarias para el funcionamiento del sitio web.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Enlace de Referido:</strong> Identificador de referencia utilizado
          en el programa de afiliados de la plataforma.
        </li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>3. Finalidad del Tratamiento</h2>
      <p style={pStyle}>Los datos recopilados se utilizan exclusivamente para las siguientes finalidades:</p>
      <ul style={ulStyle}>
        <li style={liStyle}>Facilitar la interacción del usuario con los contratos inteligentes de la plataforma.</li>
        <li style={liStyle}>Procesar y verificar transacciones en la blockchain.</li>
        <li style={liStyle}>Mantener el sistema de referidos y recompensas.</li>
        <li style={liStyle}>Mejorar la experiencia de usuario y el rendimiento del sitio web.</li>
        <li style={liStyle}>Cumplir con obligaciones legales aplicables.</li>
        <li style={liStyle}>Prevención de fraudes y actividades no autorizadas.</li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>4. Base Legal para el Tratamiento</h2>
      <p style={pStyle}>El tratamiento de datos se fundamenta en:</p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong style={strongStyle}>Consentimiento del usuario:</strong> Al conectar su wallet y
          utilizar la plataforma, el usuario acepta expresamente esta política.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Ejecución de un contrato:</strong> El tratamiento es necesario
          para la ejecución del acuerdo entre el usuario y la plataforma.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Interés legítimo:</strong> Para la mejora del servicio y prevención de fraudes.
        </li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>5. Carácter Público de los Datos en Blockchain</h2>
      <div style={boxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>IMPORTANTE:</strong> Las transacciones realizadas en la blockchain de
          Polygon son <strong style={strongStyle}>públicas, permanentes e inmutables</strong>. Las direcciones
          wallet, montos de transacción, y marcas de tiempo son visibles para cualquier persona a través de
          exploradores de bloques (ej. PolygonScan). La plataforma no puede eliminar, modificar ni controlar
          los datos registrados en la blockchain.
        </p>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>6. Conservación de los Datos</h2>
      <p style={pStyle}>
        Los datos personales se conservarán durante el tiempo necesario para cumplir las finalidades
        descritas y durante los plazos legalmente establecidos. Los datos en blockchain son permanentes
        por naturaleza de la tecnología.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>7. Derechos del Usuario</h2>
      <p style={pStyle}>El usuario tiene derecho a:</p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong style={strongStyle}>Acceso:</strong> Conocer qué datos personales están siendo tratados.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Rectificación:</strong> Solicitar la corrección de datos inexactos.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Supresión:</strong> Solicitar la eliminación de datos personales
          almacenados en nuestros sistemas (no aplica a datos en blockchain).
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Oposición:</strong> Oponerse al tratamiento de sus datos en determinadas circunstancias.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Portabilidad:</strong> Recibir sus datos en un formato estructurado.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Limitación:</strong> Solicitar la limitación del tratamiento.
        </li>
      </ul>
      <p style={pStyle}>
        Para ejercer estos derechos, el usuario puede contactar a través del correo electrónico
        proporcionado en la plataforma.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>8. Medidas de Seguridad</h2>
      <p style={pStyle}>
        Implementamos medidas técnicas y organizativas apropiadas para proteger los datos personales
        contra el acceso no autorizado, alteración, divulgación o destrucción, incluyendo:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Cifrado de datos en tránsito (HTTPS/TLS).</li>
        <li style={liStyle}>Acceso restringido a información personal.</li>
        <li style={liStyle}>Auditorías periódicas de seguridad.</li>
        <li style={liStyle}>Monitorización de actividades sospechosas.</li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>9. Transferencias Internacionales</h2>
      <p style={pStyle}>
        Dado el carácter descentralizado de la plataforma y la naturaleza pública de la blockchain,
        los datos de transacción son accesibles globalmente. No realizamos transferencias
        internacionales de datos personales más allá de lo inherente al funcionamiento de la
        blockchain de Polygon.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>10. Menores de Edad</h2>
      <p style={pStyle}>
        La plataforma no está dirigida a menores de 18 años. No recopilamos conscientemente datos
        personales de menores. Si un titular de la patria potestad o tutor legal tiene conocimiento
        de que un menor ha proporcionado datos personales, le rogamos que contacte con nosotros
        para proceder a su eliminación.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>11. Modificaciones de esta Política</h2>
      <p style={pStyle}>
        Nos reservamos el derecho de modificar esta Política de Tratamiento de Datos en cualquier momento.
        Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.
        Se recomienda a los usuarios revisar periódicamente esta política.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>12. Contacto</h2>
      <p style={pStyle}>
        Para cualquier consulta relacionada con esta Política de Tratamiento de Datos o el tratamiento
        de sus datos personales, puede contactar a través de los canales oficiales de comunicación
        de la plataforma.
      </p>
    </div>
  </LegalPage>
);

export default PrivacyPolicy;
