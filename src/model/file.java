import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class MaClasse {

    private static final Logger log = LogManager.getLogger(MaClasse.class);

    public MonDAOImpl monDao=new MonDAOImpl();

    public void maFonction(MonTypeObjet monObjet) throws Throwable {
        try {
            log.debug("Je trace mon objet en entrée de ma fonction " + monObjet.toString());
            // Faire l'injection de dépendance et utiliser monDao
            monDao.insert(monObjet);
        } catch (Exception e) {
            throw e;
        } finally {
                monDao.closeConnection();

        }
    }
}
