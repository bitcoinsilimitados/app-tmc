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
  warningBoxStyle,
} from "../Legal";

const TermsAndConditions = () => (
  <LegalPage title="Términos y Condiciones">
    <div style={sectionStyle}>
      <h2 style={h2Style}>1. Aceptación de los Términos</h2>
      <p style={pStyle}>
        Al acceder y utilizar <strong style={strongStyle}>TheMonopolyClub</strong> (en adelante, "la
        Plataforma", "el Servicio" o "el Contrato"), usted (en adelante, "el Usuario") acepta sujetarse
        a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos,
        no debe utilizar la plataforma.
      </p>
      <p style={pStyle}>
        La plataforma opera a través de contratos inteligentes descentralizados desplegados en la
        red Polygon (MATIC). El uso de la plataforma implica el conocimiento y aceptación de los
        riesgos inherentes a la tecnología blockchain y los criptoactivos.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>2. Definiciones</h2>
      <ul style={ulStyle}>
        <li style={liStyle}>
          <strong style={strongStyle}>Plataforma:</strong> El ecosistema digital TheMonopolyClub
          operado mediante contratos inteligentes en Polygon.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Contrato Inteligente (Smart Contract):</strong> Código
          programable desplegado en la blockchain de Polygon que ejecuta automáticamente las
          reglas del sistema.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>USDT:</strong> Token Tether (USDT) en la red Polygon,
          utilizado como moneda de intercambio dentro de la plataforma.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Wallet/Billetera:</strong> Software o hardware que permite
          almacenar y gestionar claves privadas para interactuar con la blockchain.
        </li>
        <li style={liStyle}>
          <strong style={strongStyle}>Gas:</strong> Comisión pagada a los validadores de la red
          Polygon por procesar transacciones.
        </li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>3. Naturaleza del Servicio</h2>
      <div style={boxStyle}>
        <h3 style={h3Style}>3.1 Sistema de Afiliados Descentralizado</h3>
        <p style={pStyle}>
          TheMonopolyClub es una plataforma de afiliados descentralizada basada en contratos inteligentes.
          El sistema opera de manera autónoma y transparente en la blockchain, sin intervención humana
          en la distribución de recompensas.
        </p>
        <h3 style={h3Style}>3.2 Sin Control Central</h3>
        <p style={pStyle}>
          Una vez desplegado, el contrato inteligente opera de forma autónoma según las reglas
          programadas. Ninguna entidad central controla, administra ni puede modificar las
          transacciones o distribuciones realizadas por el contrato.
        </p>
        <h3 style={h3Style}>3.3 Código Abierto y Verificable</h3>
        <p style={pStyle}>
          El código del contrato inteligente está disponible para su verificación pública en
          PolygonScan. Se anima a los usuarios a verificar el código antes de interactuar con la plataforma.
        </p>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>4. Requisitos para Usar la Plataforma</h2>
      <ul style={ulStyle}>
        <li style={liStyle}>Tener al menos 18 años de edad o la mayoría de edad legal en su jurisdicción.</li>
        <li style={liStyle}>Poseer una wallet compatible con la red Polygon (MetaMask, Trust Wallet, etc.).</li>
        <li style={liStyle}>Contar con fondos en USDT y MATIC (para comisiones de gas) en su wallet.</li>
        <li style={liStyle}>Cumplir con todas las leyes y regulaciones aplicables en su jurisdicción.</li>
        <li style={liStyle}>
          No residir en una jurisdicción donde el uso de criptoactivos o plataformas de afiliados
          esté prohibido o restringido.
        </li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>5. Riesgos Asociados</h2>
      <div style={warningBoxStyle}>
        <h3 style={h3Style}>5.1 Riesgo de Pérdida Total</h3>
        <p style={pStyle}>
          <strong style={strongStyle}>ADVERTENCIA IMPORTANTE:</strong> Las participaciones en plataformas
          de afiliados basadas en criptoactivos conllevan un alto riesgo de pérdida total o parcial de los
          fondos invertidos. El usuario reconoce y acepta que:
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>Puede perder la totalidad de los USDT invertidos en la plataforma.</li>
          <li style={liStyle}>Las recompensas no están garantizadas y dependen de la participación de otros usuarios.</li>
          <li style={liStyle}>No existe garantía de retorno de inversión.</li>
        </ul>

        <h3 style={h3Style}>5.2 Riesgos Tecnológicos</h3>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <strong style={strongStyle}>Errores en el código:</strong> Aunque el contrato ha sido
            verificado, existe el riesgo de errores (bugs) no detectados que podrían afectar al funcionamiento.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Vulnerabilidades:</strong> Ataques de hackers o explotación
            de vulnerabilidades en el contrato inteligente.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Fallos de red:</strong> Congestión, interrupciones o fallos
            en la red Polygon.
          </li>
          <li style={liStyle}>
            <strong style={strongStyle}>Pérdida de acceso a la wallet:</strong> Si el usuario pierde
            sus claves privadas o seed phrase, no podrá recuperar el acceso a sus fondos.
          </li>
        </ul>

        <h3 style={h3Style}>5.3 Riesgos Regulatorios</h3>
        <ul style={ulStyle}>
          <li style={liStyle}>
            Cambios regulatorios que puedan afectar la legalidad o viabilidad de la plataforma.
          </li>
          <li style={liStyle}>
            Restricciones gubernamentales sobre el uso de criptoactivos en ciertas jurisdicciones.
          </li>
          <li style={liStyle}>
            Implicaciones fiscales derivadas de las transacciones con criptoactivos.
          </li>
        </ul>

        <h3 style={h3Style}>5.4 Riesgos de Mercado</h3>
        <ul style={ulStyle}>
          <li style={liStyle}>
            Volatilidad extrema en el precio de USDT y otros criptoactivos.
          </li>
          <li style={liStyle}>
            Riesgo de despegue (depeg) de stablecoins.
          </li>
        </ul>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>6. Responsabilidades del Usuario</h2>
      <p style={pStyle}>El usuario se compromete a:</p>
      <ul style={ulStyle}>
        <li style={liStyle}>
          Mantener seguras sus claves privadas y seed phrase. Nunca compartirlas con nadie.
        </li>
        <li style={liStyle}>
          Verificar cuidadosamente las transacciones antes de confirmarlas en su wallet.
        </li>
        <li style={liStyle}>
          Verificar que interactúa con la dirección oficial del contrato inteligente.
        </li>
        <li style={liStyle}>
          Cumplir con todas las obligaciones fiscales derivadas de sus transacciones.
        </li>
        <li style={liStyle}>
          No utilizar la plataforma para actividades ilícitas, incluyendo lavado de dinero o financiación del terrorismo.
        </li>
        <li style={liStyle}>
          Utilizar la plataforma de manera responsable y asumiendo los riesgos inherentes.
        </li>
      </ul>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>7. Limitación de Responsabilidad</h2>
      <div style={warningBoxStyle}>
        <p style={pStyle}>
          <strong style={strongStyle}>EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY APLICABLE:</strong>
        </p>
        <ul style={ulStyle}>
          <li style={liStyle}>
            La plataforma se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD", sin garantías de ningún
            tipo, ya sean expresas o implícitas.
          </li>
          <li style={liStyle}>
            Los desarrolladores, operadores y asociados de la plataforma no serán responsables por
            pérdidas directas, indirectas, incidentales, especiales, consecuentes o punitivas.
          </li>
          <li style={liStyle}>
            No garantizamos la disponibilidad, continuidad o error-free funcionamiento de la plataforma.
          </li>
          <li style={liStyle}>
            El usuario asume toda la responsabilidad por el uso de la plataforma y las decisiones de inversión.
          </li>
          <li style={liStyle}>
            En ningún caso la responsabilidad total excederá el monto invertido por el usuario en los últimos 30 días.
          </li>
        </ul>
      </div>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>8. Propiedad Intelectual</h2>
      <p style={pStyle}>
        El código fuente del contrato inteligente y el diseño de la plataforma están protegidos
        por derechos de autor y propiedad intelectual. Se otorga una licencia limitada, no exclusiva
        y revocable para acceder y utilizar la plataforma de acuerdo con estos términos.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>9. Modificaciones de los Términos</h2>
      <p style={pStyle}>
        Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento.
        Los cambios serán efectivos al publicarse en la plataforma. El uso continuado de la plataforma
        después de la publicación de cambios constituye la aceptación de los nuevos términos.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>10. Ley Aplicable y Jurisdicción</h2>
      <p style={pStyle}>
        Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables. Cualquier
        disputa será resuelta a través de mecanismos de resolución descentralizada cuando sea posible,
        o en los tribunales competentes según la ley aplicable.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>11. Indemnización</h2>
      <p style={pStyle}>
        El usuario acepta indemnizar y mantener indemne a los desarrolladores, operadores y asociados
        de la plataforma contra cualquier reclamación, daño, pérdida, responsabilidad, coste u gasto
        derivado del uso de la plataforma o violación de estos términos.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>12. Nulidad Parcial</h2>
      <p style={pStyle}>
        Si alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones
        restantes seguirán siendo válidas y en pleno efecto. La disposición inválida será reemplazada
        por una disposición válida que se acerque lo más posible a la intención original.
      </p>
    </div>

    <div style={sectionStyle}>
      <h2 style={h2Style}>13. Acuerdo Completo</h2>
      <p style={pStyle}>
        Estos Términos y Condiciones, junto con la Política de Privacidad y el Aviso Legal,
        constituyen el acuerdo completo entre el usuario y la plataforma con respecto al uso del servicio.
      </p>
    </div>
  </LegalPage>
);

export default TermsAndConditions;
