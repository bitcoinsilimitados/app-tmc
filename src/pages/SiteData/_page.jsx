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

const CookiePolicy = () => (
  <LegalPage title="Política de Cookies">
    <div style={sectionStyle}>
      <h2 style={h2Style}>1. ¿Qué son las Cookies?</h2>
      <p style={pStyle}>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo
        del usuario (ordenador, tableta, smartphone) cuando este los visita. Se utilizan para
        hacer que los sitios web funcionen de manera más eficiente, para proporcionar información
        a los propietarios del sitio y para mejorar la experiencia del usuario.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>2. Uso de Cookies en Nuestra Plataforma</h2>
      <p style={pStyle}>
        TheMonopolyClub utiliza cookies y tecnologías similares para garantizar el correcto
        funcionamiento del sitio web, mejorar la experiencia del usuario y recopilar datos
        analíticos sobre el uso de la plataforma.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>3. Tipos de Cookies que Utilizamos</h2>

      <h3 style={h3Style}>3.1 Cookies Estrictamente Necesarias</h3>
      <p style={pStyle}>
        Estas cookies son esenciales para el funcionamiento básico del sitio web. Sin ellas,
        el sitio no puede funcionar correctamente. Se utilizan para:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Mantener la sesión del usuario activa.</li>
        <li style={liStyle}>Recordar preferencias de visualización.</li>
        <li style={liStyle}>Garantizar la seguridad del sitio.</li>
        <li style={liStyle}>Distribuir el tráfico entre servidores (balanceo de carga).</li>
      </ul>
      <div style={boxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>Base legal:</strong> Interés legítimo (no requieren consentimiento).
        </p>
      </div>

      <h3 style={h3Style}>3.2 Cookies de Rendimiento y Análisis</h3>
      <p style={pStyle}>
        Estas cookies nos permiten contar las visitas y fuentes de tráfico para medir y mejorar
        el rendimiento de nuestro sitio. Nos ayudan a saber qué páginas son las más y las menos
        populares, y a ver cómo se mueven los visitantes por el sitio.
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Google Analytics o servicios similares (si aplica).</li>
        <li style={liStyle}>Herramientas de análisis de rendimiento.</li>
      </ul>
      <div style={boxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>Base legal:</strong> Consentimiento del usuario.
        </p>
      </div>

      <h3 style={h3Style}>3.3 Cookies Funcionales</h3>
      <p style={pStyle}>
        Estas cookies permiten que el sitio web proporcione una funcionalidad y personalización
        mejoradas. Pueden ser establecidas por nosotros o por proveores externos cuyos servicios
        hemos añadido a nuestras páginas.
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Preferencias de idioma.</li>
        <li style={liStyle}>Configuración regional.</li>
        <li style={liStyle}>Recordar preferencias del usuario.</li>
      </ul>
      <div style={boxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>Base legal:</strong> Consentimiento del usuario.
        </p>
      </div>

      <h3 style={h3Style}>3.4 Cookies de Terceros</h3>
      <p style={pStyle}>
        Algunas cookies pueden ser establecidas por servicios de terceros que aparecen en nuestras
        páginas. No controlamos la operación de estas cookies. Estos terceros pueden incluir:
      </p>
      <ul style={ulStyle}>
        <li style={liStyle}>Proveedores de análisis (Google Analytics).</li>
        <li style={liStyle}>Servicios de redes sociales (si aplica).</li>
        <li style={liStyle}>Proveedores de contenido externo.</li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>4. Cookies en la Interacción con Contratos Inteligentes</h2>
      <p style={pStyle}>
        Al interactuar con los contratos inteligentes de la plataforma a través de su wallet
        (por ejemplo, MetaMask), no se almacenan cookies en relación con dichas transacciones,
        ya que estas ocurren directamente entre el usuario y la blockchain. Sin embargo, las
        wallets pueden utilizar su propio sistema de almacenamiento local para recordar
        preferencias del usuario.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>5. Gestión de Cookies</h2>
      <p style={pStyle}>
        El usuario puede configurar su navegador para rechazar todas las cookies, aceptar solo
        algunas cookies, o ser notificado cuando se envíen cookies. Sin embargo, si desactiva
        o rechaza las cookies, es posible que partes de este sitio web no funcionen correctamente.
      </p>
      <h3 style={h3Style}>Instrucciones para gestionar cookies en navegadores comunes:</h3>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong style={strongStyle}>Google Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Mozilla Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Safari:</strong> Preferencias → Privacidad → Gestión de datos del sitio web
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Microsoft Edge:</strong> Configuración → Cookies y permisos de sitios
        </li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>6. Actualizaciones de esta Política</h2>
      <p style={pStyle}>
        Podemos actualizar esta Política de Cookies para reflejar cambios en las cookies
        que utilizamos o por motivos operativos, legales o regulatorios. Le recomendamos
        revisar esta política periódicamente para estar informado sobre cómo utilizamos las cookies.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>7. Más Información</h2>
      <p style={pStyle}>
        Si tiene preguntas sobre nuestro uso de cookies o sobre esta Política de Cookies,
        puede contactarnos a través de los canales oficiales de comunicación de la plataforma.
      </p>
    </div>
  </LegalPage>
);

export default CookiePolicy;
